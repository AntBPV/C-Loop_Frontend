import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ConveniosService,ConvenioResponse,UpdateConvenioDto} from '../../core/services/convenios-service';
import { API_CONFIG } from '../../core/config/api.config';
import { FormsModule } from '@angular/forms';
import { EditConvenio } from '../edit-convenio/edit-convenio';

export interface ConvenioHistory {
  id: string;
  convenioId: string;
  previousStatus: string | null;
  newStatus: string;
  previousStage: string | null;
  newStage: string | null;
  comment: string | null;
  performedById: string;
  performedAt: string;
}

export interface ConvenioDocumento {
  id: string;
  convenioId: string;
  documentType: string;
  stage: string;
  fileName: string;
  generatedAt: string;
  notes: string | null;
}

type TabActiva = 'info' | 'historial' | 'documentos';

@Component({
  selector: 'app-convenio-detail',
  standalone: true,
  imports: [CommonModule, EditConvenio],
  templateUrl: './convenio-detail.html',
  styleUrl: './convenio-detail.css',
})
export class ConvenioDetail implements OnChanges {
  @Input() convenioId: string | null = null;

  tabActiva = signal<TabActiva>('info');
  isLoading = signal(true);
  error = signal<string | null>(null);
  convenio = signal<ConvenioResponse | null>(null);
  historial = signal<ConvenioHistory[]>([]);
  isLoadingHistorial = signal(false);
  documentos = signal<ConvenioDocumento[]>([]);
  isLoadingDocumentos = signal(false);
  showEditModal = signal(false);
  showRequestDocumentsModal = signal(false);
  isRequestingDocuments = signal(false);

  editableStatuses = [
    'BORRADOR',
    'EMPRESA_PENDIENTE',
    'PENDIENTE_DOCUMENTOS_EMPRESA',
    'DOCUMENTOS_EMPRESA_RECIBIDOS',
    'DOCUMENTOS_OBSERVADOS_EMPRESA',
    'DOCUMENTOS_APROBADOS',
    'LISTO_PARA_RADICAR',
  ];

  constructor(
    private http: HttpClient,
    private conveniosService: ConveniosService,
  ) {}

  ngOnChanges() {
    if (this.convenioId) {
      this.cargarConvenio();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarConvenio() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http
      .get<ConvenioResponse>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.getById(this.convenioId!)}`,
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: (data) => {
          this.convenio.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el convenio.');
          this.isLoading.set(false);
        },
      });
  }

  cargarHistorial() {
    this.isLoadingHistorial.set(true);
    this.http
      .get<
        ConvenioHistory[]
      >(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.history(this.convenioId!)}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.historial.set(data);
          this.isLoadingHistorial.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el historial.');
          this.isLoadingHistorial.set(false);
        },
      });
  }

  cargarDocumentos() {
    this.isLoadingDocumentos.set(true);
    this.http
      .get<
        ConvenioDocumento[]
      >(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.documents(this.convenioId!)}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.documentos.set(data);
          this.isLoadingDocumentos.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los documentos.');
          this.isLoadingDocumentos.set(false);
        },
      });
  }

  descargarDocumento(documentoId: string, fileName: string) {
    this.http
      .get(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.downloadDocument(this.convenioId!, documentoId)}`,
        { headers: this.getHeaders(), responseType: 'blob' },
      )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => this.error.set('No se pudo descargar el documento.'),
      });
  }
  onConvenioUpdated(data: ConvenioResponse) {
    this.convenio.set(data);

    this.showEditModal.set(false);
  }

  canRequestCompanyDocuments(): boolean {
    const convenio = this.convenio();

    if (!convenio) return false;

    return ['BORRADOR', 'EMPRESA_PENDIENTE'].includes(convenio.currentStatus);
  }

  canEditConvenio(): boolean {
    const convenio = this.convenio();

    if (!convenio) return false;

    return this.editableStatuses.includes(convenio.currentStatus);
  }

  setTab(tab: TabActiva) {
    this.tabActiva.set(tab);
    if (tab === 'historial' && this.historial().length === 0) {
      this.cargarHistorial();
    }
    if (tab === 'documentos' && this.documentos().length === 0) {
      this.cargarDocumentos();
    }
  }

  requestCompanyDocuments() {
    if (!this.convenioId) return;

    this.isRequestingDocuments.set(true);

    this.conveniosService.requestCompanyDocuments(this.convenioId).subscribe({
      next: () => {
        this.showRequestDocumentsModal.set(false);

        this.isRequestingDocuments.set(false);

        this.cargarConvenio();
      },

      error: () => {
        this.error.set('No se pudo solicitar los documentos a la empresa.');

        this.isRequestingDocuments.set(false);
      },
    });
  }
}
