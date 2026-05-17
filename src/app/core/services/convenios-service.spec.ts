import { TestBed } from '@angular/core/testing';

import { Convenios } from './convenios-service';

describe('Convenios', () => {
  let service: Convenios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Convenios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
