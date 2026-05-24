import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingFormalization } from '../../../../../core/services/dashboard-service';

@Component({
  selector: 'app-formalization-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formalization-card.html',
  styleUrl: './formalization-card.css',
})
export class FormalizationCard {
  @Input({ required: true }) formalization!: PendingFormalization;
}
