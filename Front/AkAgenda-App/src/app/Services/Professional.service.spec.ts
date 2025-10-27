/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProfessionalService } from './Professional.service';

describe('Service: Professional', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessionalService]
    });
  });

  it('should ...', inject([ProfessionalService], (service: ProfessionalService) => {
    expect(service).toBeTruthy();
  }));
});
