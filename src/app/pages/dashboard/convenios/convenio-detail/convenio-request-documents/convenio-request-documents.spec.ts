import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioRequestDocuments } from './convenio-request-documents';

describe('ConvenioRequestDocuments', () => {
  let component: ConvenioRequestDocuments;
  let fixture: ComponentFixture<ConvenioRequestDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioRequestDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioRequestDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
