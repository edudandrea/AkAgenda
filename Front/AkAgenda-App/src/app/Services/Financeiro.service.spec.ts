/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FinanceiroService } from './Financeiro.service';

describe('Service: Financeiro', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceiroService]
    });
  });

  it('should ...', inject([FinanceiroService], (service: FinanceiroService) => {
    expect(service).toBeTruthy();
  }));
});
