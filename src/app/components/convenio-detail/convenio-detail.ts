import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../core/config/api.config';
import { FormsModule } from '@angular/forms';

export interface ConvenioDetail {
  id: string;
  code: string;
  companyId: string;
  companyNit: string;
  companyBusinessName: string;
  createdById: string;
  currentStatus: string;
  currentStage: string | null;
  convenioType: string;
  convenioTypeLabel: string;
  rectorSignerLabel: string;
  currentVersionId: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  revisionIssueCount: number;
}

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

type TabActiva = 'info' | 'historial' | 'documentos';

@Component({
  selector: 'app-convenio-detail',
  imports: [CommonModule],
  templateUrl: './convenio-detail.html',
  styleUrl: './convenio-detail.css',
})
export class ConvenioDetail implements OnChanges {
  @Input() convenioId: string | null = null;

  tabActiva = signal<TabActiva>('info');
  isLoading = signal(true);
  error = signal<string | null>(null);
  convenio = signal<ConvenioDetail | null>(null);
  historial = signal<ConvenioHistory[]>([]);

  constructor(private http: HttpClient) {}

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
      .get<ConvenioDetail>(
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
    this.http
      .get<
        ConvenioHistory[]
      >(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.history(this.convenioId!)}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.historial.set(data),
        error: () => this.error.set('No se pudo cargar el historial.'),
      });
  }

  setTab(tab: TabActiva) {
    this.tabActiva.set(tab);
    if (tab === 'historial' && this.historial().length === 0) {
      this.cargarHistorial();
    }
  }
}
