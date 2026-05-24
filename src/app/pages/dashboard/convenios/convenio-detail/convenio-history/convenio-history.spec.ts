import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioHistory } from './convenio-history';

describe('ConvenioHistory', () => {
  let component: ConvenioHistory;
  let fixture: ComponentFixture<ConvenioHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
