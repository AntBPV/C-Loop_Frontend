import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresasService, EmpresaResponse } from '../../core/services/empresas-service';
import { ConveniosService } from '../../core/services/convenios-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../core/config/api.config';

type TabActiva = 'basico' | 'detalles';

interface IConvenioForm {
  companyId: string;
  convenioType: string;
  title: string;
  durationMonths: number;
  objective: string;
  description: string;
  externalEntityObligations: string;
  universityObligations: string;
}

@Component({
  selector: 'app-convenio-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './convenio-form.html',
  styleUrl: './convenio-form.css',
})
export class ConvenioForm implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() creado = new EventEmitter<void>();

  tabActiva = signal<TabActiva>('basico');
  isLoading = signal(false);
  isLoadingEmpresas = signal(true);
  error = signal<string | null>(null);
  empresas = signal<EmpresaResponse[]>([]);

  tiposConvenio = [
    { value: 'MARCO', label: 'Marco' },
    { value: 'PRACTICA', label: 'Práctica' },
    { value: 'BIENESTAR', label: 'Bienestar' },
    { value: 'DESCUENTO', label: 'Descuento' },
  ];

  form: IConvenioForm = {
    companyId: '',
    convenioType: '',
    title: '',
    durationMonths: 12,
    objective: '',
    description: '',
    externalEntityObligations: '',
    universityObligations: '',
  };

  constructor(
    private empresasService: EmpresasService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.empresasService.getEmpresas().subscribe({
      next: (data) => {
        this.empresas.set(data);
        this.isLoadingEmpresas.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las empresas.');
        this.isLoadingEmpresas.set(false);
      },
    });
  }

  tab1Valido(): boolean {
    return (
      !!this.form.companyId &&
      !!this.form.convenioType &&
      !!this.form.title &&
      this.form.durationMonths > 0
    );
  }

  tab2Valido(): boolean {
    return (
      !!this.form.objective &&
      !!this.form.description &&
      !!this.form.externalEntityObligations &&
      !!this.form.universityObligations
    );
  }

  siguienteTab() {
    if (this.tabActiva() === 'basico' && this.tab1Valido()) {
      this.tabActiva.set('detalles');
    }
  }

  onSubmit() {
    if (!this.tab2Valido()) return;
    this.isLoading.set(true);
    this.error.set(null);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { ...this.form, estimatedValue: 0 };

    this.http
      .post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.convenios.create}`, body, { headers })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.creado.emit();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set('No se pudo crear el convenio. Intenta nuevamente.');
          console.log(err);
        },
      });
  }
}
