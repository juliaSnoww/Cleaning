import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {ReserveService} from '../service/reserve.service';

@Injectable({
  providedIn: 'root'
})
export class ReserveGuard implements CanActivate {

  constructor(private reserveService: ReserveService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isReserve = this.reserveService.isHasReserve();
    if (!isReserve) {
      this.router.navigate(['/']);
    }
    return isReserve;
  }
}
