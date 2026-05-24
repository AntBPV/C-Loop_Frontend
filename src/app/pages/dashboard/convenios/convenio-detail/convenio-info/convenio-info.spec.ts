import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioInfo } from './convenio-info';

describe('ConvenioInfo', () => {
  let component: ConvenioInfo;
  let fixture: ComponentFixture<ConvenioInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
