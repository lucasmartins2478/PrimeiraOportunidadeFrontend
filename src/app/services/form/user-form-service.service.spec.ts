import { TestBed } from '@angular/core/testing';

import { UserFormServiceService } from './user-form-service.service';

describe('UserFormServiceService', () => {
  let service: UserFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
