import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresasService, EmpresaResponse } from '../../core/services/empresas-service';
import { API_CONFIG } from '../../core/config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';


type TabActiva = 'info' | 'historial';

export interface EmpresaHistory {
  id: string;
  companyId: string;
  previousStatus: string | null;
  newStatus: string;
  comment: string | null;
  performedById: string;
  performedAt: string;
}

@Component({
  selector: 'app-empresa-detail',
  imports: [CommonModule],
  templateUrl: './empresa-detail.html',
  styleUrl: './empresa-detail.css',
})
export class EmpresaDetail implements OnChanges {
  @Input() empresaId: string | null = null;

  tabActiva = signal<TabActiva>('info');
  isLoading = signal(true);
  error = signal<string | null>(null);
  empresa = signal<EmpresaResponse | null>(null);
  historial = signal<EmpresaHistory[]>([]);
  isLoadingHistorial = signal(false);

  constructor(
    private empresasService: EmpresasService,
    private http: HttpClient,
  ) {}

  ngOnChanges() {
    if (this.empresaId) {
      this.cargarEmpresa();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarEmpresa() {
    this.isLoading.set(true);
    this.error.set(null);

    this.empresasService.getEmpresaById(this.empresaId!).subscribe({
      next: (data) => {
        this.empresa.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la empresa.');
        this.isLoading.set(false);
      },
    });
  }

  cargarHistorial() {
    this.isLoadingHistorial.set(true);
    this.http
      .get<
        EmpresaHistory[]
      >(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.companies.history(this.empresaId!)}`, { headers: this.getHeaders() })
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

  setTab(tab: TabActiva) {
    this.tabActiva.set(tab);
    if (tab === 'historial' && this.historial().length === 0) {
      this.cargarHistorial();
    }
  }
}
