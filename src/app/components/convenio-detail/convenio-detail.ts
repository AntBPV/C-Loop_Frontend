import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConveniosService, ConvenioResponse } from '../../core/services/convenios-service';
import { API_CONFIG } from '../../core/config/api.config';
import { ConvenioHeader } from './convenio-header/convenio-header';
import { ConvenioTabs, TabActiva } from './convenio-tabs/convenio-tabs';
import { ConvenioInfo } from './convenio-info/convenio-info';
import { ConvenioHistory, ConvenioHistoryEntry } from './convenio-history/convenio-history';
import { ConvenioDocuments, ConvenioDocumento } from './convenio-documents/convenio-documents';
import { ConvenioDocumentReview } from './convenio-document-review/convenio-document-review';
import { EditConvenio } from '../edit-convenio/edit-convenio';
import { ConvenioRequestDocuments } from './convenio-request-documents/convenio-request-documents';

@Component({
  selector: 'app-convenio-detail',
  standalone: true,
  imports: [
    CommonModule,
    ConvenioHeader,
    ConvenioTabs,
    ConvenioInfo,
    ConvenioHistory,
    ConvenioDocuments,
    ConvenioDocumentReview,
    EditConvenio,
    ConvenioRequestDocuments
  ],
  templateUrl: './convenio-detail.html',
  styleUrl: './convenio-detail.css',
})
export class ConvenioDetail implements OnChanges {
  @Input() convenioId: string | null = null;

  tabActiva = signal<TabActiva>('info');
  isLoading = signal(true);
  error = signal<string | null>(null);
  convenio = signal<ConvenioResponse | null>(null);
  historial = signal<ConvenioHistoryEntry[]>([]);
  isLoadingHistorial = signal(false);
  documentos = signal<ConvenioDocumento[]>([]);
  isLoadingDocumentos = signal(false);
  showEditModal = signal(false);
  showRequestDocumentsModal = signal(false);

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
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  cargarConvenio() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http
      .get<ConvenioResponse>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.getById(this.convenioId!)}`,
        {
          headers: this.getHeaders(),
        },
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
      .get<ConvenioHistoryEntry[]>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.history(this.convenioId!)}`,
        {
          headers: this.getHeaders(),
        },
      )
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
      .get<ConvenioDocumento[]>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.documents(this.convenioId!)}`,
        {
          headers: this.getHeaders(),
        },
      )
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

  descargarDocumento(documento: ConvenioDocumento) {
    this.http
      .get(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.downloadDocument(
          this.convenioId!,
          documento.id,
        )}`,
        {
          headers: this.getHeaders(),
          responseType: 'blob',
        },
      )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = documento.fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },

        error: () => {
          this.error.set('No se pudo descargar el documento.');
        },
      });
  }

  onConvenioUpdated(data: ConvenioResponse) {
    this.convenio.set(data);

    this.showEditModal.set(false);
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
}
