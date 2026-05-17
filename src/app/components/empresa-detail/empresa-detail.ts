import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresasService, EmpresaResponse } from '../../core/services/empresas-service';

type TabActiva = 'info' | 'historial';

@Component({
  selector: 'app-empresa-detail',
  imports: [CommonModule],
  templateUrl: './empresa-detail.html',
  styleUrl: './empresa-detail.css',
})
export class EmpresaDetail implements OnChanges {
  @Input() empresaId: string | null = null;

  tabActiva = signal<TabActiva>('info');
  isLoading = signal(true);
  error = signal<string | null>(null);
  empresa = signal<EmpresaResponse | null>(null);

  constructor(private empresasService: EmpresasService) {}

  ngOnChanges() {
    if (this.empresaId) {
      this.cargarEmpresa();
    }
  }

  cargarEmpresa() {
    this.isLoading.set(true);
    this.error.set(null);

    this.empresasService.getEmpresaById(this.empresaId!).subscribe({
      next: (data) => {
        this.empresa.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la empresa.');
        this.isLoading.set(false);
      },
    });
  }

  setTab(tab: TabActiva) {
    this.tabActiva.set(tab);
  }
}
