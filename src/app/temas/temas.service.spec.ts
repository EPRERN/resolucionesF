/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TemasService } from './temas.service';

describe('Service: Temas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemasService]
    });
  });

  it('should ...', inject([TemasService], (service: TemasService) => {
    expect(service).toBeTruthy();
  }));
});
