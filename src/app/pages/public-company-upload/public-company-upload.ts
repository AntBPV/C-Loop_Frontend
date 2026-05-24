import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../core/config/api.config';

export interface RequiredDocument {
  documentType: string;
  displayName: string;
}

export interface PublicUploadResponse {
  requestId: string;
  convenioId: string;
  convenioCode: string;
  companyName: string;
  status: string;
  roundNumber: number;
  expiresAt: string;
  requiredDocuments: RequiredDocument[];
}

@Component({
  selector: 'app-public-company-upload',
  imports: [CommonModule],
  templateUrl: './public-company-upload.html',
  styleUrl: './public-company-upload.css',
})
export class PublicCompanyUpload implements OnInit {
  isLoading = signal(true);

  error = signal<string | null>(null);

  uploadData = signal<PublicUploadResponse | null>(null);

  selectedFiles = signal<Record<string, File | null>>({});
  uploadingDocuments = signal<Record<string, boolean>>({});
  uploadedDocuments = signal<Record<string, boolean>>({});
  documentErrors = signal<Record<string, string>>({});

  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');

    if (!this.token) {
      this.error.set('Token inválido.');

      this.isLoading.set(false);

      return;
    }

    this.cargarSolicitud();
  }

  cargarSolicitud() {
    this.isLoading.set(true);

    this.error.set(null);

    this.http
      .get<PublicUploadResponse>(`${API_CONFIG.baseUrl}/api/public/company-upload/${this.token}`)
      .subscribe({
        next: (data) => {
          this.uploadData.set(data);

          this.isLoading.set(false);
        },

        error: () => {
          this.error.set('No se pudo cargar la solicitud de documentos.');

          this.isLoading.set(false);
        },
      });
  }

  onFileSelected(event: Event, documentType: string) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    this.selectedFiles.update((current) => ({
      ...current,
      [documentType]: file,
    }));
  }

  uploadDocument(documentType: string, displayName: string) {
    const token = this.token;

    if (!token) return;

    const file = this.selectedFiles()[documentType];

    if (!file) return;

    this.uploadingDocuments.update((current) => ({
      ...current,
      [documentType]: true,
    }));

    const formData = new FormData();

    formData.append('documentType', documentType);
    formData.append('displayName', displayName);
    formData.append('file', file);

    this.http
      .post(`${API_CONFIG.baseUrl}/api/public/company-upload/${token}/documents`, formData)
      .subscribe({
        next: () => {
          this.uploadedDocuments.update((current) => ({
            ...current,
            [documentType]: true,
          }));

          this.uploadingDocuments.update((current) => ({
            ...current,
            [documentType]: false,
          }));
        },

        error: () => {
          this.documentErrors.update((current) => ({
            ...current,
            [documentType]: 'No se pudo subir el documento.',
          }));

          this.uploadingDocuments.update((current) => ({
            ...current,
            [documentType]: false,
          }));
        },
      });
  }

  tokenExpirado(): boolean {
    const data = this.uploadData();

    if (!data) return false;

    return new Date(data.expiresAt) < new Date();
  }
}
