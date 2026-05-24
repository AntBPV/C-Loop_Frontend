import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioTabs } from './convenio-tabs';

describe('ConvenioTabs', () => {
  let component: ConvenioTabs;
  let fixture: ComponentFixture<ConvenioTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
