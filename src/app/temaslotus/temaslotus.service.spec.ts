/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TemaslotusService } from './temaslotus.service';

describe('Service: Temaslotus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemaslotusService]
    });
  });

  it('should ...', inject([TemaslotusService], (service: TemaslotusService) => {
    expect(service).toBeTruthy();
  }));
});
