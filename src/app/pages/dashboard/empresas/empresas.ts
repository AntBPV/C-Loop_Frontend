import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmpresasService,
  EmpresaResponse,
  EmpresaStatus,
} from '../../../core/services/empresas-service';
import { EmpresaDetail } from '../../../components/empresa-detail/empresa-detail';
import { ItemEstado, ItemCard, ItemCardData } from '../../../components/item-card/item-card';
import { SvgIcon } from '../../../components/svg-icon/svg-icon';
import { EmpresaForm } from '../../../components/empresa-form/empresa-form';

interface FiltroConfig {
  estado: ItemEstado;
  label: string;
  color: string;
}

@Component({
  selector: 'app-empresas',
  imports: [CommonModule, ItemCard, EmpresaDetail, SvgIcon, EmpresaForm],
  templateUrl: './empresas.html',
  styleUrl: './empresas.css',
})
export class Empresas implements OnInit {
  readonly EMPRESAS_POR_PAGINA = 10;

  todasLasEmpresas = signal<ItemCardData[]>([]);
  filtrosActivos = signal<Set<ItemEstado>>(new Set());
  paginaActual = signal(0);
  isLoading = signal(true);
  error = signal<string | null>(null);
  empresaSeleccionada = signal<string | null>(null);

  filtros: FiltroConfig[] = [
    { estado: 'ok', label: 'Validada', color: 'var(--color-ui-green)' },
    { estado: 'atencion', label: 'Pendiente validación', color: 'var(--color-ui-yellow)' },
    { estado: 'notificacion', label: 'Observada', color: 'var(--color-ui-blue)' },
    { estado: 'por-vencer', label: 'Rechazada', color: 'var(--color-ui-red)' },
    { estado: 'vencido', label: 'Borrador', color: 'var(--color-surface-gray-400)' },
  ];

  empresasFiltradas = computed(() => {
    const activos = this.filtrosActivos();
    if (activos.size === 0) return this.todasLasEmpresas();
    return this.todasLasEmpresas().filter((e) => activos.has(e.estado));
  });

  empresasPaginadas = computed(() => {
    const inicio = this.paginaActual() * this.EMPRESAS_POR_PAGINA;
    return this.empresasFiltradas().slice(inicio, inicio + this.EMPRESAS_POR_PAGINA);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.empresasFiltradas().length / this.EMPRESAS_POR_PAGINA),
  );

  constructor(private empresasService: EmpresasService) {}

  ngOnInit() {
    this.empresasService.getEmpresas().subscribe({
      next: (data) => {
        this.todasLasEmpresas.set(data.map((e) => this.mapearEmpresa(e)));
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las empresas.');
        this.isLoading.set(false);
      },
    });
  }

  mapearEmpresa(e: EmpresaResponse): ItemCardData {
    return {
      id: e.id,
      titulo: e.businessName,
      campos: [
        { label: 'NIT', valor: e.nit },
        { label: 'Representado por', valor: e.legalRepresentativeName },
        { label: 'Correo', valor: e.contactEmail },
      ],
      estado: this.empresasService.calcularEstado(e.status),
    };
  }

  toggleFiltro(estado: ItemEstado) {
    const activos = new Set(this.filtrosActivos());
    if (activos.has(estado)) {
      activos.delete(estado);
    } else {
      activos.add(estado);
    }
    this.filtrosActivos.set(activos);
    this.paginaActual.set(0);
    this.empresaSeleccionada.set(null);
  }

  esFiltroActivo(estado: ItemEstado): boolean {
    return this.filtrosActivos().has(estado);
  }

  limpiarFiltros() {
    this.filtrosActivos.set(new Set());
    this.paginaActual.set(0);
  }

  irAPagina(pagina: number) {
    this.paginaActual.set(pagina);
    this.empresaSeleccionada.set(null);
  }

  mostrarForm = signal(false);
}
