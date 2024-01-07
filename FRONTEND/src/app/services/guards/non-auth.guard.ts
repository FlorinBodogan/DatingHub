import { CanActivateFn } from '@angular/router';
import { AccountService } from '../account/account.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);

  return accountService.currentUser$.pipe(
    map(user => {
      return user ? false : true;
    })
  )
};
