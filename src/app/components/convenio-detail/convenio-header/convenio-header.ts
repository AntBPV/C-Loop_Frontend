import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvenioResponse } from '../../../core/services/convenios-service';

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

  editableStatuses = [
    'BORRADOR',
    'EMPRESA_PENDIENTE',
    'PENDIENTE_DOCUMENTOS_EMPRESA',
    'DOCUMENTOS_EMPRESA_RECIBIDOS',
    'DOCUMENTOS_OBSERVADOS_EMPRESA',
    'DOCUMENTOS_APROBADOS',
    'LISTO_PARA_RADICAR',
  ];

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
      'PENDIENTE_DOCUMENTOS_EMPRESA',
      'DOCUMENTOS_OBSERVADOS_EMPRESA',
    ].includes(convenio.currentStatus);
  }
}
