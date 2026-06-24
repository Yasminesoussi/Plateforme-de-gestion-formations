import { inject } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CanActivateFn, Router } from '@angular/router';

export const formateurRoleGuard: CanActivateFn = (route, state) => {
  const user = inject(AuthServiceService);
  const router = inject(Router);
  if(window.sessionStorage.getItem('auth-user')!==null && user.getUser().user.role =='formateur') {
     return true;
  } else {

    router.navigate(['signInUser']);
    return false
  }
};

