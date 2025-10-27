/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicosService } from './Servicos.service';

describe('Service: Servicos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicosService]
    });
  });

  it('should ...', inject([ServicosService], (service: ServicosService) => {
    expect(service).toBeTruthy();
  }));
});
