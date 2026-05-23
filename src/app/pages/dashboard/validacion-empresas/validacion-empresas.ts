import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmpresasService,
  EmpresaResponse,
  PendingValidationCompany,
} from '../../../core/services/empresas-service';
import { EmpresaDetail } from '../../../components/empresa-detail/empresa-detail';

@Component({
  selector: 'app-validacion-empresas',
  imports: [CommonModule, EmpresaDetail],
  templateUrl: './validacion-empresas.html',
  styleUrl: './validacion-empresas.css',
})
export class ValidacionEmpresas implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);

  empresas = signal<PendingValidationCompany[]>([]);

  empresaSeleccionadaId = signal<string | null>(null);

  constructor(private empresasService: EmpresasService) {}

  ngOnInit() {
    this.cargarEmpresasPendientes();
  }

  cargarEmpresasPendientes() {
    this.isLoading.set(true);
    this.error.set(null);

    this.empresasService.getPendingValidation().subscribe({
      next: (data) => {
        this.empresas.set(data);

        this.isLoading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.error.set('No se pudieron cargar las empresas pendientes.');

        this.isLoading.set(false);
      },
    });
  }

  seleccionarEmpresa(id: string) {
    this.empresaSeleccionadaId.set(id);
  }

  cerrarDetalle() {
    this.empresaSeleccionadaId.set(null);
  }

  onEmpresaActualizada() {
    this.cerrarDetalle();

    this.cargarEmpresasPendientes();
  }
}
