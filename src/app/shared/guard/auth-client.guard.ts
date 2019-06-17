import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';

import {AuthService} from '../service/auth.service';

@Injectable()
export class AuthClientGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuth = this.authService.getIsAuth();
    const isClient = this.authService.isClientType();
    if (!isAuth) {
      this.router.navigate(['/login']);
    } else if (!isClient) this.router.navigate(['/']);
    return isClient;
  }
}
