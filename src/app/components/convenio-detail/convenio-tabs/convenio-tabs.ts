import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabActiva = 'info' | 'historial' | 'documentos' | 'documentos-empresa';

@Component({
  selector: 'app-convenio-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenio-tabs.html',
  styleUrl: './convenio-tabs.css',
})
export class ConvenioTabs {
  @Input() tabActiva!: TabActiva;

  @Output() tabChange = new EventEmitter<TabActiva>();

  setTab(tab: TabActiva) {
    this.tabChange.emit(tab);
  }
}
