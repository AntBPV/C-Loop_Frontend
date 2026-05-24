import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingApproval } from '../../../../core/services/dashboard-service';
import { ApprovalCard } from './approval-card/approval-card';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [CommonModule, ApprovalCard],
  templateUrl: './pending-approvals.html',
  styleUrl: './pending-approvals.css',
})
export class PendingApprovals {
  @Input({ required: true }) approvals: PendingApproval[] = [];

  @Output() review = new EventEmitter<PendingApproval>();

  onReview(approval: PendingApproval) {
    this.review.emit(approval);
  }
}
