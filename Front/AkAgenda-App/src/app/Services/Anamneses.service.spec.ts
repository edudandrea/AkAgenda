/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnamnesesService } from './Anamneses.service';

describe('Service: Anamneses', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnamnesesService]
    });
  });

  it('should ...', inject([AnamnesesService], (service: AnamnesesService) => {
    expect(service).toBeTruthy();
  }));
});
