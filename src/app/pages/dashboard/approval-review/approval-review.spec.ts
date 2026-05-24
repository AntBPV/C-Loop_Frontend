import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalReview } from './approval-review';

describe('ApprovalReview', () => {
  let component: ApprovalReview;
  let fixture: ComponentFixture<ApprovalReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalReview],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
