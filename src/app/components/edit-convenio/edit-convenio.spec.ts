import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConvenio } from './edit-convenio';

describe('EditConvenio', () => {
  let component: EditConvenio;
  let fixture: ComponentFixture<EditConvenio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConvenio],
    }).compileComponents();

    fixture = TestBed.createComponent(EditConvenio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
