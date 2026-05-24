import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingApproval } from '../../../../../core/services/dashboard-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approval-card.html',
  styleUrl: './approval-card.css',
})
export class ApprovalCard {
  @Input({ required: true }) approval!: PendingApproval;

  @Output() review = new EventEmitter<PendingApproval>();

  constructor(private router: Router) {}

  // goToReview() {
  //   this.router.navigate(['/dashboard/approval-review', this.approval.stepId]);
  // }
  goToReview() {
    this.router.navigate(['/dashboard/approval-review', this.approval.stepId], {
      state: {
        approval: {
          id: this.approval.stepId,
          convenioId: this.approval.convenioId,
          stage: this.approval.stage,
        },
      },
    });
  }
}
