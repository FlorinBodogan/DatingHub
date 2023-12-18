import { TestBed } from '@angular/core/testing';

import { LoadingEffectService } from './loading-effect.service';

describe('LoadingEffectService', () => {
  let service: LoadingEffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
