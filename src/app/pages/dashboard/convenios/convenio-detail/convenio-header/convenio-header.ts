import { Component, EventEmitter, Input, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvenioResponse } from '../../../../../core/services/convenios-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../../../../core/config/api.config';

@Component({
  selector: 'app-convenio-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenio-header.html',
  styleUrl: './convenio-header.css',
})
export class ConvenioHeader {
  @Input() convenio!: ConvenioResponse;
  @Input() canEdit = false;
  @Input() canRequestDocuments = false;
  @Output() edit = new EventEmitter<void>();
  @Output() requestDocuments = new EventEmitter<void>();

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  submitted = output<void>();

  editableStatuses = [
    'BORRADOR',
    'EMPRESA_PENDIENTE',
    'PENDIENTE_DOCUMENTOS_EMPRESA',
    'DOCUMENTOS_EMPRESA_RECIBIDOS',
    'DOCUMENTOS_OBSERVADOS_EMPRESA',
    'DOCUMENTOS_APROBADOS',
    'LISTO_PARA_RADICAR',
  ];

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  canEditConvenio(): boolean {
    const convenio = this.convenio;
    if (!convenio) {
      return false;
    }

    return [
      'BORRADOR',
      'EMPRESA_PENDIENTE',
      'PENDIENTE_DOCUMENTOS_EMPRESA',
      'DOCUMENTOS_EMPRESA_RECIBIDOS',
      'DOCUMENTOS_OBSERVADOS_EMPRESA',
      'DOCUMENTOS_APROBADOS',
      'LISTO_PARA_RADICAR',
    ].includes(convenio.currentStatus);
  }

  canRequestCompanyDocuments(): boolean {
    const convenio = this.convenio;
    if (!convenio) {
      return false;
    }

    return [
      'BORRADOR',
      'EMPRESA_PENDIENTE',

      // TODO: Eliminar para producción
      // 'PENDIENTE_DOCUMENTOS_EMPRESA',
      // 'DOCUMENTOS_OBSERVADOS_EMPRESA',
    ].includes(convenio.currentStatus);
  }

  canSubmitConvenio(): boolean {
    if (!this.convenio) {
      return false;
    }

    return this.convenio.currentStatus === 'LISTO_PARA_RADICAR';
  }

  submitConvenio() {
    if (!this.convenio) {
      return;
    }

    this.isSubmitting.set(true);

    this.submitError.set(null);

    this.http
      .post(
        `${API_CONFIG.baseUrl}/api/convenios/${this.convenio.id}/submit`,
        {},
        {
          headers: this.getHeaders(),
        },
      )
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);

          this.submitted.emit();
        },

        error: () => {
          this.submitError.set('No se pudo enviar el convenio a validación institucional.');

          this.isSubmitting.set(false);
        },
      });
  }
}
