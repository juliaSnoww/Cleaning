import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.autoAuthUser();
    const isAuth = this.authService.getIsAuth();
    if (isAuth) this.authService.getUserInfoQuery();
  }
}

