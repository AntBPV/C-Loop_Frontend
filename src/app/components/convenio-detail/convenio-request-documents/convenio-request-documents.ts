import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConveniosService } from '../../../core/services/convenios-service';

@Component({
  selector: 'app-convenio-request-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenio-request-documents.html',
  styleUrl: './convenio-request-documents.css',
})
export class ConvenioRequestDocuments {
  @Input() convenioId!: string;

  @Output() cerrar = new EventEmitter<void>();

  @Output() requested = new EventEmitter<void>();

  isRequestingDocuments = signal(false);

  error = signal<string | null>(null);

  constructor(private conveniosService: ConveniosService) {}

  close() {
    this.cerrar.emit();
  }

  requestCompanyDocuments() {
    this.error.set(null);

    this.isRequestingDocuments.set(true);

    this.conveniosService.requestCompanyDocuments(this.convenioId).subscribe({
      next: () => {
        this.isRequestingDocuments.set(false);

        this.requested.emit();

        this.close();
      },

      error: () => {
        this.error.set('No se pudo solicitar los documentos a la empresa.');

        this.isRequestingDocuments.set(false);
      },
    });
  }
}
