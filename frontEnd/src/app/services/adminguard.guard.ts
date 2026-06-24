import { AuthServiceService } from 'src/app/services/auth-service.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminguardGuard: CanActivateFn = (route, state) => {

  const user = inject(AuthServiceService);
  const router = inject(Router);
  if(window.localStorage.getItem('auth-user')!==null && user.getUser().admin.role =='admin') {
     return true;
  } else {

    router.navigate(['adminlogin']);
    return false
  }
};
