/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ResolucionesService } from './resoluciones.service';

describe('Service: Resoluciones', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResolucionesService]
    });
  });

  it('should ...', inject([ResolucionesService], (service: ResolucionesService) => {
    expect(service).toBeTruthy();
  }));
});
