import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuth;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.userAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatus()
      .subscribe(isAuth => {
        this.userAuth = isAuth;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
