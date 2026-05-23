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

  tokenExpirado(): boolean {
    const data = this.uploadData();

    if (!data) return false;

    return new Date(data.expiresAt) < new Date();
  }
}
