import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormalizationCard } from './formalization-card';

describe('FormalizationCard', () => {
  let component: FormalizationCard;
  let fixture: ComponentFixture<FormalizationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormalizationCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FormalizationCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
