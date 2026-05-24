import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConvenioHistoryEntry {
  id: string;
  convenioId: string;
  previousStatus: string | null;
  newStatus: string;
  previousStage: string | null;
  newStage: string | null;
  comment: string | null;
  performedById: string;
  performedAt: string;
}

@Component({
  selector: 'app-convenio-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenio-history.html',
  styleUrl: './convenio-history.css',
})
export class ConvenioHistory {
  @Input() historial: ConvenioHistoryEntry[] = [];

  @Input() isLoading = false;
}
