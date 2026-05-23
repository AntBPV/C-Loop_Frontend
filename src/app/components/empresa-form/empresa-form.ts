import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../core/config/api.config';

interface IEmpresaForm {
  nit: string;
  businessName: string;
  tradeName: string;
  identificationType: string;
  legalRepresentativeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

@Component({
  selector: 'app-empresa-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa-form.html',
  styleUrl: './empresa-form.css',
})
export class EmpresaForm {
  @Output() cerrar = new EventEmitter<void>();
  @Output() creada = new EventEmitter<void>();

  isLoading = signal(false);
  error = signal<string | null>(null);

  tiposIdentificacion = [
    { value: 'NIT', label: 'NIT' },
    { value: 'CC', label: 'Cédula de ciudadanía' },
    { value: 'CE', label: 'Cédula de extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
  ];

  form: IEmpresaForm = {
    nit: '',
    businessName: '',
    tradeName: '',
    identificationType: '',
    legalRepresentativeName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  };

  constructor(private http: HttpClient) {}

  formValido(): boolean {
    return (
      !!this.form.nit &&
      !!this.form.businessName &&
      !!this.form.tradeName &&
      !!this.form.identificationType &&
      !!this.form.legalRepresentativeName &&
      !!this.form.contactEmail &&
      !!this.form.contactPhone &&
      !!this.form.address
    );
  }

  onSubmit() {
    if (!this.formValido()) return;
    this.isLoading.set(true);
    this.error.set(null);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.companies.create}`, this.form, { headers })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.creada.emit();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set('No se pudo crear la empresa. Intenta nuevamente.');
          console.log(err);
        },
      });
  }
}
