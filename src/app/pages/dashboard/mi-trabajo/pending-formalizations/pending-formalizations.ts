import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingFormalization } from '../../../../core/services/dashboard-service';
import { FormalizationCard } from './formalization-card/formalization-card';

@Component({
  selector: 'app-pending-formalizations',
  standalone: true,
  imports: [CommonModule, FormalizationCard],
  templateUrl: './pending-formalizations.html',
  styleUrl: './pending-formalizations.css',
})
export class PendingFormalizations {
  @Input({ required: true }) formalizations: PendingFormalization[] = [];
}
