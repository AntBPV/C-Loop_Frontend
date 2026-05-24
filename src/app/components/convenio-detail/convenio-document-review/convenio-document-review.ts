import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { API_CONFIG } from '../../../core/config/api.config';

export interface CompanyDocument {
  id: string;
  requestId: string;
  convenioId: string;
  documentType: string;
  displayName: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  status: string;
  reviewComment: string | null;
  uploadedAt: string;
  approvedAt: string | null;
  reviewedAt: string | null;
  reviewedById: string | null;
  reviewedByName: string | null;
  replacedByDocumentId: string | null;
  deletedFromStorageAt: string | null;
  deletionReason: string | null;
}

@Component({
  selector: 'app-convenio-document-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './convenio-document-review.html',
  styleUrl: './convenio-document-review.css',
})
export class ConvenioDocumentReview implements OnChanges {
  @Input() convenioId!: string;

  isLoading = signal(true);

  isSubmitting = signal(false);

  error = signal<string | null>(null);
  success = signal<string | null>(null);

  documentos = signal<CompanyDocument[]>([]);

  reviewComments = signal<Record<string, string>>({});

  reviewDecisions = signal<Record<string, 'approve' | 'observe' | null>>({});

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    if (this.convenioId) {
      this.cargarDocumentos();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private limpiarMensajes() {
    this.error.set(null);
    this.success.set(null);
  }

  private obtenerMensajeError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string') {
        return error.error;
      }

      if (error.error?.message) {
        return error.error.message;
      }

      if (error.error?.error) {
        return error.error.error;
      }
    }

    return fallback;
  }

  cargarDocumentos() {
    this.isLoading.set(true);

    this.limpiarMensajes();

    this.http
      .get<CompanyDocument[]>(
        `${API_CONFIG.baseUrl}/api/convenios/${this.convenioId}/company-documents`,
        {
          headers: this.getHeaders(),
        },
      )
      .subscribe({
        next: (data) => {
          this.documentos.set(data);

          this.isLoading.set(false);
        },

        error: () => {
          this.error.set('No se pudieron cargar los documentos.');

          this.isLoading.set(false);
        },
      });
  }

  esDocumentoActivo(doc: CompanyDocument): boolean {
    return !['ELIMINADO', 'REEMPLAZADO'].includes(doc.status);
  }

  actualizarComentario(documentId: string, value: string) {
    this.reviewComments.update((current) => ({
      ...current,
      [documentId]: value,
    }));
  }

  marcarParaAprobacion(documentId: string) {
    this.reviewDecisions.update((current) => ({
      ...current,
      [documentId]: 'approve',
    }));
  }

  marcarParaObservacion(documentId: string) {
    this.reviewDecisions.update((current) => ({
      ...current,
      [documentId]: 'observe',
    }));
  }

  obtenerDecision(documentId: string): 'approve' | 'observe' | null {
    return this.reviewDecisions()[documentId] ?? null;
  }

  getDecisionClasses(documentId: string): string {
    const decision = this.obtenerDecision(documentId);

    if (decision === 'approve') {
      return 'border-ui-blue bg-surface-blue';
    }

    if (decision === 'observe') {
      return 'border-ui-red bg-surface-red';
    }

    return 'border-surface-gray-200';
  }

  puedeSolicitarCorrecciones(): boolean {
    return this.documentos()
      .filter((doc) => this.esDocumentoActivo(doc))
      .some((doc) => this.obtenerDecision(doc.id) === 'observe');
  }

  puedeAprobarDocumentacion(): boolean {
    const activos = this.documentos().filter((doc) => this.esDocumentoActivo(doc));

    if (activos.length === 0) {
      return false;
    }

    return activos.every((doc) => {
      // Ya aprobado previamente
      if (doc.status === 'APROBADO') {
        return true;
      }

      // Marcado para aprobar en esta sesión
      return this.obtenerDecision(doc.id) === 'approve';
    });
  }

  async finalizarCorrecciones() {
    this.isSubmitting.set(true);

    this.limpiarMensajes();

    try {
      const documentosObservados = this.documentos().filter(
        (doc) => this.esDocumentoActivo(doc) && this.obtenerDecision(doc.id) === 'observe',
      );

      for (const doc of documentosObservados) {
        const comentario = this.reviewComments()[doc.id];

        if (!comentario?.trim()) {
          throw new Error(`Debe escribir un comentario para ${doc.displayName}`);
        }

        await this.http
          .post(
            `${API_CONFIG.baseUrl}/api/convenios/${this.convenioId}/company-documents/${doc.id}/observe`,
            {
              comment: comentario,
              deletePhysicalFile: true,
            },
            {
              headers: this.getHeaders(),
            },
          )
          .toPromise();
      }

      await this.http
        .post(
          `${API_CONFIG.baseUrl}/api/convenios/${this.convenioId}/company-documents/request-correction`,
          {
            comment: 'Debe corregir los documentos observados y volver a cargarlos.',
          },
          {
            headers: this.getHeaders(),
          },
        )
        .toPromise();

      this.success.set('Correcciones solicitadas correctamente.');

      this.reviewComments.set({});
      this.reviewDecisions.set({});

      this.cargarDocumentos();
    } catch (error) {
      if (error instanceof Error) {
        this.error.set(error.message);
      } else {
        this.error.set(
          this.obtenerMensajeError(error, 'No se pudo solicitar la corrección documental.'),
        );
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async finalizarAprobacion() {
    this.isSubmitting.set(true);

    this.limpiarMensajes();

    try {
      const documentosAprobados = this.documentos().filter(
        (doc) => this.esDocumentoActivo(doc) && this.obtenerDecision(doc.id) === 'approve',
      );

      for (const doc of documentosAprobados) {
        await this.http
          .post(
            `${API_CONFIG.baseUrl}/api/convenios/${this.convenioId}/company-documents/${doc.id}/approve`,
            {},
            {
              headers: this.getHeaders(),
            },
          )
          .toPromise();
      }

      await this.http
        .post(
          `${API_CONFIG.baseUrl}/api/convenios/${this.convenioId}/mark-documents-approved`,
          {},
          {
            headers: this.getHeaders(),
          },
        )
        .toPromise();

      this.success.set('Documentación aprobada correctamente.');

      this.reviewComments.set({});
      this.reviewDecisions.set({});

      this.cargarDocumentos();
    } catch (error) {
      this.error.set(this.obtenerMensajeError(error, 'No se pudo aprobar la documentación.'));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
