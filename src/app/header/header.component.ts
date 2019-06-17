import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userAuth;
  private isCompany = false;
  private isAdmin = false;
  private clientTypeSubscription: Subscription;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {
    this.authListenerSubs = this.authService
      .getAuthStatus()
      .subscribe(isAuth => this.userAuth = isAuth);
    this.clientTypeSubscription = this.authService
      .getClientTypeStatus()
      .subscribe(
        value => this.isCompany = !value,
        err => console.log(err));
    this.authService.getIsAdminListener().subscribe((response: boolean) => {
      this.isAdmin = response;
    });
  }

  ngOnInit() {
    this.userAuth = this.authService.getIsAuth();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.clientTypeSubscription.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
