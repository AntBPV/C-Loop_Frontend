import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ConveniosService,
  ConvenioResponse,
  UpdateConvenioDto,
} from '../../core/services/convenios-service';

import { EmpresasService, EmpresaResponse } from '../../core/services/empresas-service';

@Component({
  selector: 'app-edit-convenio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-convenio.html',
  styleUrl: './edit-convenio.css',
})
export class EditConvenio implements OnChanges {
  @Input() convenio!: ConvenioResponse;

  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<ConvenioResponse>();

  isLoading = signal(false);
  isLoadingEmpresas = signal(false);

  error = signal<string | null>(null);

  empresas = signal<EmpresaResponse[]>([]);

  tiposConvenio = [
    { value: 'MARCO', label: 'Marco' },
    { value: 'PRACTICA', label: 'Práctica' },
    { value: 'BIENESTAR', label: 'Bienestar' },
    { value: 'DESCUENTO', label: 'Descuento' },
  ];

  editModel = signal<UpdateConvenioDto>({
    companyId: '',
    convenioType: '',

    title: '',
    objective: '',
    description: '',

    durationMonths: 12,

    externalEntityObligations: '',
    universityObligations: '',

    estimatedValue: 0,

    startDate: null,
    endDate: null,
  });

  constructor(
    private conveniosService: ConveniosService,
    private empresasService: EmpresasService,
  ) {}

  ngOnChanges() {
    if (!this.convenio) return;

    this.editModel.set({
      companyId: this.convenio.companyId,
      convenioType: this.convenio.convenioType,

      title: this.convenio.title,
      objective: this.convenio.objective,
      description: this.convenio.description,

      durationMonths: this.convenio.durationMonths,

      externalEntityObligations: this.convenio.externalEntityObligations,
      universityObligations: this.convenio.universityObligations,

      estimatedValue: this.convenio.estimatedValue,

      startDate: this.convenio.startDate,
      endDate: this.convenio.endDate,
    });

    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.isLoadingEmpresas.set(true);

    this.empresasService.getEmpresas().subscribe({
      next: (data) => {
        const empresasValidadas = data.filter((e) => e.status === 'VALIDADA');

        this.empresas.set(empresasValidadas);

        this.isLoadingEmpresas.set(false);
      },

      error: () => {
        this.isLoadingEmpresas.set(false);
      },
    });
  }

  saveChanges() {
    this.isLoading.set(true);

    this.conveniosService.updateConvenio(this.convenio.id, this.editModel()).subscribe({
      next: (data) => {
        this.isLoading.set(false);

        this.actualizado.emit(data);
      },

      error: () => {
        this.error.set('No se pudo actualizar el convenio.');

        this.isLoading.set(false);
      },
    });
  }
}
