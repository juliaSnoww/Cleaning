import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate() {
    const isAdmin = this.authService.getIsAdmin();
    if (!isAdmin) this.router.navigate(['/']);
    return this.authService.getIsAdmin();
  }

}
