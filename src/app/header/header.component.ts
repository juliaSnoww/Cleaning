import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userAuth = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAuthStatus().subscribe(isAuth => {
      this.userAuth = isAuth;
    });
  }

}
