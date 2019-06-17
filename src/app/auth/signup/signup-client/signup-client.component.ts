import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrls: ['./signup-client.component.scss']
})
export class SignupClientComponent implements OnInit, OnDestroy {
  signupFormClient: FormGroup;
  passMatch = true;
  error: string;

  constructor(private authService: AuthService,
              private router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.signupFormClient = new FormGroup({
      name: new FormControl('jul', Validators.required),
      email: new FormControl('test@mail.ru', [Validators.required, Validators.email]),
      password: new FormControl('123', Validators.required),
      passConfirm: new FormControl('123', Validators.required)
    });
  }

  onSubmit() {
    const pass = this.signupFormClient.get('password').value;
    const passConfirm = this.signupFormClient.get('passConfirm').value;
    if (pass !== passConfirm) {
      this.passMatch = false;
      return;
    }
    this.authService.createUser(this.signupFormClient.value).subscribe(
      response => this.router.navigate(['/']),
      err => {
        this.cookieService.deleteAll();
        this.error = err.error.message;
      }
    );
  }

  ngOnDestroy() {
    this.signupFormClient.reset();
  }
}
