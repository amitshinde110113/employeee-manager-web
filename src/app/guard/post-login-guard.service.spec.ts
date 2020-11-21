import { TestBed } from '@angular/core/testing';

import { PostLoginGuardService } from './post-login-guard.service';

describe('PostLoginGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostLoginGuardService = TestBed.get(PostLoginGuardService);
    expect(service).toBeTruthy();
  });
});
