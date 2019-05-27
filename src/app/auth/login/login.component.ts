import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/service/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isClient = true;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('test@mail.ru', [Validators.required, Validators.email]),
      password: new FormControl('123', Validators.required)
    });
  }

  onLogin() {
    if (this.isClient) {
      this.authService.login(this.loginForm.value);
    } else {
      this.authService.loginCompany(this.loginForm.value);
    }
  }

  onSelectRole(item) {
    this.loginForm.reset();
    if (item) this.isClient = true;
    else this.isClient = false;
  }

}
