import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ApprovalAction = 'approve' | 'request-correction' | 'reject';

@Component({
  selector: 'app-approval-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-actions.html',
  styleUrl: './approval-actions.css',
})
export class ApprovalActions {
  @Input({ required: true }) canApprove = false;

  @Input({ required: true }) canRequestCorrection = false;

  @Input({ required: true }) canReject = false;

  @Input() isLoading = false;

  @Input() error: string | null = null;

  @Output() action = new EventEmitter<{
    type: ApprovalAction;
    comment: string;
  }>();

  comment = signal('');

  submit(type: ApprovalAction) {
    this.action.emit({
      type,
      comment: this.comment(),
    });
  }
}
