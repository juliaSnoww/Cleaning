import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {AuthService} from '../service/auth.service';

@Injectable()
export class AuthCompanyGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isClientType() || !this.authService.getIsAuth())
      this.router.navigate(['/main']);
    return !this.authService.isClientType();
  }
}
