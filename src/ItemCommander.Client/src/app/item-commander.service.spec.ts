import { TestBed, inject } from '@angular/core/testing';

import { ItemCommanderService } from './item-commander.service';

describe('ItemCommanderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemCommanderService]
    });
  });

  it('should be created', inject([ItemCommanderService], (service: ItemCommanderService) => {
    expect(service).toBeTruthy();
  }));
});
