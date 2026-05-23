import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCompanyUpload } from './public-company-upload';

describe('PublicCompanyUpload', () => {
  let component: PublicCompanyUpload;
  let fixture: ComponentFixture<PublicCompanyUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCompanyUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicCompanyUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
