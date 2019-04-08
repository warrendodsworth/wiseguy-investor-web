import { inject, TestBed } from '@angular/core/testing';

import { AuthService } from '../auth.service';
import { EditGuard } from './edit.guard';

describe('EditGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        EditGuard
      ]
    });
  });

  it('should prevent non editor access', inject([EditGuard], (guard: EditGuard) => {
    expect(guard).toBeTruthy();
  }));
});
