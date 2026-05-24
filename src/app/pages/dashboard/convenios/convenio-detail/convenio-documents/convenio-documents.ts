import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConvenioDocumento {
  id: string;
  convenioId: string;
  documentType: string;
  stage: string;
  fileName: string;
  generatedAt: string;
  notes: string | null;
}

@Component({
  selector: 'app-convenio-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenio-documents.html',
  styleUrl: './convenio-documents.css',
})
export class ConvenioDocuments {
  @Input() documentos: ConvenioDocumento[] = [];

  @Input() isLoading = false;

  @Output() descargar = new EventEmitter<ConvenioDocumento>();

  descargarDocumento(documento: ConvenioDocumento) {
    this.descargar.emit(documento);
  }
}
