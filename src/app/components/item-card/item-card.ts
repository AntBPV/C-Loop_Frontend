import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SvgIcon } from '../svg-icon/svg-icon';

export type ItemEstado = 'ok' | 'atencion' | 'por-vencer' | 'vencido' | 'notificacion' | 'borrador' | 'en-proceso' | 'cancelado';

export interface ItemCardData {
  id: string;
  titulo: string;
  subtitulo?: string;
  campos: { label: string; valor: string }[];
  estado: ItemEstado;
}

@Component({
  selector: 'app-item-card',
  imports: [CommonModule, SvgIcon],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css',
})
export class ItemCard {
  @Input() item!: ItemCardData;
  @Input() seleccionado = false;
  @Output() cardClick = new EventEmitter<void>();

  estadoConfig: Record<
    ItemEstado,
    { badgeColor: string; textColor: string; iconColor: string; icon: string }
  > = {
    ok: {
      badgeColor: 'var(--color-ui-green)',
      textColor: 'var(--color-ui-green)',
      iconColor: 'var(--color-surface-green)',
      icon: 'icons/ok.svg',
    },
    atencion: {
      badgeColor: 'var(--color-ui-yellow)',
      textColor: 'var(--color-ui-yellow)',
      iconColor: 'var(--color-surface-yellow)',
      icon: 'icons/atencion.svg',
    },
    'por-vencer': {
      badgeColor: 'var(--color-ui-red)',
      textColor: 'var(--color-ui-red)',
      iconColor: 'var(--color-surface-red)',
      icon: 'icons/por-vencer.svg',
    },
    notificacion: {
      badgeColor: 'var(--color-ui-blue)',
      textColor: 'var(--color-ui-blue)',
      iconColor: 'var(--color-surface-blue)',
      icon: 'icons/notificacion.svg',
    },
    vencido: {
      badgeColor: 'var(--color-surface-gray-400)',
      textColor: 'var(--color-surface-gray-400)',
      iconColor: 'var(--color-surface-gray-200)',
      icon: 'icons/por-vencer.svg',
    },
    borrador: {
      badgeColor: 'var(--color-ui-blue-active)',
      textColor: 'var(--color-ui-blue-active)',
      iconColor: 'var(--color-surface-blue)',
      icon: 'icons/borrador.svg',
    },
    'en-proceso': {
      badgeColor: 'var(--color-ui-yellow)',
      textColor: 'var(--color-ui-yellow)',
      iconColor: 'var(--color-surface-yellow)',
      icon: 'icons/en-proceso.svg',
    },
    cancelado: {
      badgeColor: 'var(--color-surface-gray-400)',
      textColor: 'var(--color-surface-gray-400)',
      iconColor: 'var(--color-surface-gray-200)',
      icon: 'icons/por-vencer.svg',
    },
  };

  get config() {
    return this.estadoConfig[this.item.estado];
  }

  onCardClick() {
    this.cardClick.emit();
  }
}
