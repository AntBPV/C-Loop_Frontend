import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFormalizations } from './pending-formalizations';

describe('PendingFormalizations', () => {
  let component: PendingFormalizations;
  let fixture: ComponentFixture<PendingFormalizations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingFormalizations],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingFormalizations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
