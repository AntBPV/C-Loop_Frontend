import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiTrabajo } from './mi-trabajo';

describe('MiTrabajo', () => {
  let component: MiTrabajo;
  let fixture: ComponentFixture<MiTrabajo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiTrabajo],
    }).compileComponents();

    fixture = TestBed.createComponent(MiTrabajo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
