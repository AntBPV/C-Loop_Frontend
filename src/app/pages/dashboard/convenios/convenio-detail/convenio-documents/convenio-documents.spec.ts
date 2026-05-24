import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioDocuments } from './convenio-documents';

describe('ConvenioDocuments', () => {
  let component: ConvenioDocuments;
  let fixture: ComponentFixture<ConvenioDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
