import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioDocumentReview } from './convenio-document-review';

describe('ConvenioDocumentReview', () => {
  let component: ConvenioDocumentReview;
  let fixture: ComponentFixture<ConvenioDocumentReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioDocumentReview],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioDocumentReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
