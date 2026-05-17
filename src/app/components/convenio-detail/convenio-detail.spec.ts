import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioDetail } from './convenio-detail';

describe('ConvenioDetail', () => {
  let component: ConvenioDetail;
  let fixture: ComponentFixture<ConvenioDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvenioDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvenioDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
