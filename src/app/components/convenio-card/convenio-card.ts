import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgIcon } from '../svg-icon/svg-icon';

export type ConvenioEstado = 'ok' | 'atencion' | 'por-vencer' | 'notificacion';

export interface ConvenioCardData {
  titulo: string;
  empresa: string;
  tipo: string;
  fechaVencimiento: string;
  estado: ConvenioEstado;
  iconPath?: string;
}

@Component({
  selector: 'app-convenio-card',
  imports: [CommonModule, SvgIcon],
  templateUrl: './convenio-card.html',
  styleUrl: './convenio-card.css',
})
export class ConvenioCard {
  @Input() convenio!: ConvenioCardData;

  estadoConfig: Record<ConvenioEstado, { bg: string; border: string; icon: string }> = {
    'ok':          { bg: 'bg-ui-green',   border: 'border-ui-green',   icon: 'icons/ok.svg' },
    'atencion':    { bg: 'bg-ui-yellow',  border: 'border-ui-yellow',  icon: 'icons/atencion.svg' },
    'por-vencer':  { bg: 'bg-ui-red',     border: 'border-ui-red',     icon: 'icons/por-vencer.svg' },
    'notificacion':{ bg: 'bg-ui-blue',    border: 'border-ui-blue',    icon: 'icons/notificacion.svg' },
  };

  get config() {
    return this.estadoConfig[this.convenio.estado];
  }

  get badgeColor(): string {
    const colors: Record<ConvenioEstado, string> = {
      'ok':           'var(--color-ui-green)',
      'atencion':     'var(--color-ui-yellow)',
      'por-vencer':   'var(--color-ui-red)',
      'notificacion': 'var(--color-ui-blue)',
    };
    return colors[this.convenio.estado];
  }
  get iconColor(): string {
    const colors: Record<ConvenioEstado, string> = {
      'ok':           'var(--color-surface-green)',
      'atencion':     'var(--color-surface-yellow)',
      'por-vencer':   'var(--color-surface-red)',
      'notificacion': 'var(--color-surface-blue)',
    };
    return colors[this.convenio.estado];
  }

  onCardClick() {
    // TODO: navegar al detalle del convenio
    console.log('Convenio seleccionado:', this.convenio.titulo);
  }
}
