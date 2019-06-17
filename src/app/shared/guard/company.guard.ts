import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {CompanyService} from '../service/company.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {
  constructor(private companyService: CompanyService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isCompanySelected = this.companyService.getCompanySelectedStatus();
    if (!isCompanySelected) {
      this.router.navigate(['/']);
    }
    return isCompanySelected;
  }
}
