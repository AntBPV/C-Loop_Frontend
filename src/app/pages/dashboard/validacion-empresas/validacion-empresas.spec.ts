import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionEmpresas } from './validacion-empresas';

describe('ValidacionEmpresas', () => {
  let component: ValidacionEmpresas;
  let fixture: ComponentFixture<ValidacionEmpresas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacionEmpresas],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidacionEmpresas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
