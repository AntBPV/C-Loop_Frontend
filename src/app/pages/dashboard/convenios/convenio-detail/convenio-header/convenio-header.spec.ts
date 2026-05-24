import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioHeader } from './convenio-header';

describe('ConvenioHeader', () => {
  let component: ConvenioHeader;
  let fixture: ComponentFixture<ConvenioHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
