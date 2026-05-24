import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalCard } from './approval-card';

describe('ApprovalCard', () => {
  let component: ApprovalCard;
  let fixture: ComponentFixture<ApprovalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
