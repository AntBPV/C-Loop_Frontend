import { Component, Input, OnChanges, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresasService, EmpresaResponse } from '../../core/services/empresas-service';
import { API_CONFIG } from '../../core/config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthService, CurrentUser} from '../../core/services/auth-service';


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
export class EmpresaDetail implements OnChanges, OnInit {
  @Input() empresaId: string | null = null;

  tabActiva = signal<TabActiva>('info');
  isLoading = signal(true);
  error = signal<string | null>(null);
  empresa = signal<EmpresaResponse | null>(null);
  historial = signal<EmpresaHistory[]>([]);

  currentUser = signal<CurrentUser | null>(null);
  allowedValidationRoles = ['ADMIN', 'GESTOR_PROYECCION', 'REVISOR_JURIDICO'];

  isSubmitting = signal(false);
  actionError = signal<string | null>(null);
  actionSuccess = signal<string | null>(null);

  isLoadingHistorial = signal(false);

  constructor(
    private empresasService: EmpresasService,
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  ngOnChanges() {
    if (this.empresaId) {
      this.cargarEmpresa();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },

      error: (err) => {
        console.error(err);
        this.currentUser.set(null);
      },
    });
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

  submitForValidation() {
    if (!this.empresaId) return;

    this.isSubmitting.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.empresasService.submitValidation(this.empresaId).subscribe({
      next: () => {
        this.actionSuccess.set('Empresa enviada a validación.');

        // REFRESH AUTOMÁTICO
        this.cargarEmpresa();
        this.cargarHistorial();

        this.isSubmitting.set(false);
      },

      error: (err) => {
        console.error(err);

        this.actionError.set('No se pudo enviar la empresa a validación.');
        this.isSubmitting.set(false);
      },
    });
  }

  approveCompany() {
    if (!this.empresaId) return;

    this.isSubmitting.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.empresasService.validateCompany(this.empresaId).subscribe({
      next: () => {
        this.actionSuccess.set('Empresa validada correctamente.');

        this.cargarEmpresa();
        this.cargarHistorial();

        this.isSubmitting.set(false);
      },

      error: (err) => {
        console.error(err);

        this.actionError.set('No se pudo validar la empresa.');
        this.isSubmitting.set(false);
      },
    });
  }

  observeCompany() {
    if (!this.empresaId) return;

    const comment = prompt('Ingrese el motivo de observación');

    if (!comment || comment.trim().length === 0) {
      return;
    }

    this.isSubmitting.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.empresasService.observeCompany(this.empresaId, comment).subscribe({
      next: () => {
        this.actionSuccess.set('Empresa observada correctamente.');

        this.cargarEmpresa();
        this.cargarHistorial();

        this.isSubmitting.set(false);
      },

      error: (err) => {
        console.error(err);

        this.actionError.set('No se pudo observar la empresa.');
        this.isSubmitting.set(false);
      },
    });
  }

  rejectCompany() {
    if (!this.empresaId) return;

    const comment = prompt('Ingrese el motivo de rechazo');

    if (!comment || comment.trim().length === 0) {
      return;
    }

    this.isSubmitting.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.empresasService.rejectCompany(this.empresaId, comment).subscribe({
      next: () => {
        this.actionSuccess.set('Empresa rechazada correctamente.');

        this.cargarEmpresa();
        this.cargarHistorial();

        this.isSubmitting.set(false);
      },

      error: (err) => {
        console.error(err);

        this.actionError.set('No se pudo rechazar la empresa.');
        this.isSubmitting.set(false);
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

  canValidateCompanies(): boolean {
    const user = this.currentUser();

    if (!user) return false;

    return user.roles.some((role) => this.allowedValidationRoles.includes(role));
  }
}
