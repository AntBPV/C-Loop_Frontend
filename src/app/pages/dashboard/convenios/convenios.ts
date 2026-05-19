import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConveniosService, ConvenioResponse } from '../../../core/services/convenios-service';
import { ItemCard, ItemCardData, ItemEstado } from '../../../components/convenio-card/item-card';
import { ConvenioDetail } from '../../../components/convenio-detail/convenio-detail';
import { ConvenioForm } from '../../../components/convenio-form/convenio-form';
import { SvgIcon } from '../../../components/svg-icon/svg-icon';

interface FiltroConfig {
  estado: ItemEstado;
  label: string;
  color: string;
  borderColor: string;
}

@Component({
  selector: 'app-convenios',
  imports: [CommonModule, ItemCard, ConvenioDetail, ConvenioForm, SvgIcon],
  templateUrl: './convenios.html',
  styleUrl: './convenios.css',
})
export class Convenios implements OnInit {
  // Cambia este valor para ajustar cuántos convenios se muestran por página
  readonly CONVENIOS_POR_PAGINA = 9;

  todosLosConvenios = signal<ItemCardData[]>([]);
  filtrosActivos = signal<Set<ItemEstado>>(new Set());
  paginaActual = signal(0);
  isLoading = signal(true);
  error = signal<string | null>(null);
  convenioSeleccionado = signal<string | null>(null);

  filtros: FiltroConfig[] = [
    {
      estado: 'ok',
      label: 'Al día',
      color: 'var(--color-ui-green)',
      borderColor: 'var(--color-ui-green)',
    },
    {
      estado: 'atencion',
      label: 'Atención',
      color: 'var(--color-ui-yellow)',
      borderColor: 'var(--color-ui-yellow)',
    },
    {
      estado: 'por-vencer',
      label: 'Por vencer',
      color: 'var(--color-ui-red)',
      borderColor: 'var(--color-ui-red)',
    },
    {
      estado: 'vencido',
      label: 'Vencido',
      color: 'var(--color-surface-gray-400)',
      borderColor: 'var(--color-surface-gray-400)',
    },
  ];

  conveniosFiltrados = computed(() => {
    const activos = this.filtrosActivos();
    if (activos.size === 0) return this.todosLosConvenios();
    return this.todosLosConvenios().filter((c) => activos.has(c.estado));
  });

  conveniosPaginados = computed(() => {
    const inicio = this.paginaActual() * this.CONVENIOS_POR_PAGINA;
    return this.conveniosFiltrados().slice(inicio, inicio + this.CONVENIOS_POR_PAGINA);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.conveniosFiltrados().length / this.CONVENIOS_POR_PAGINA),
  );

  constructor(private conveniosService: ConveniosService) {}

  ngOnInit() {
    this.conveniosService.getConvenios().subscribe({
      next: (data) => {
        this.todosLosConvenios.set(data.map((c) => this.mapearConvenio(c)));
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los convenios.');
        this.isLoading.set(false);
      },
    });
  }

  mapearConvenio(c: ConvenioResponse): ItemCardData {
    return {
      id: c.id,
      titulo: c.code,
      campos: [
        { label: 'Empresa', valor: c.companyBusinessName },
        { label: 'Tipo', valor: c.convenioTypeLabel },
        { label: 'Finaliza en', valor: c.endDate ?? 'Sin fecha' },
      ],
      estado: this.conveniosService.calcularEstado(c),
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
    this.convenioSeleccionado.set(null);
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
    this.convenioSeleccionado.set(null);
  }

  mostrarForm = signal(false);
}
