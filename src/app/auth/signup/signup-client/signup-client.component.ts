import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrls: ['./signup-client.component.scss']
})
export class SignupClientComponent implements OnInit, OnDestroy {
  signupFormClient: FormGroup;
  passMatch = true;

  constructor() {
  }

  ngOnInit() {
    this.signupFormClient = new FormGroup({
      username: new FormControl('jul', Validators.required),
      email: new FormControl('test@mail.ru', [Validators.required, Validators.email]),
      password: new FormControl('123', Validators.required),
      passConfirm: new FormControl('123', Validators.required)
    });
  }

  onSubmit() {
    let pass;
    let passConfirm;
    pass = this.signupFormClient.get('password').value;
    passConfirm = this.signupFormClient.get('passConfirm').value;
    if (pass !== passConfirm) {
      this.passMatch = false;
      return;
    }
    // this.authService.createUser(
    //   this.signupForm.get('username').value,
    //   this.signupForm.get('email').value,
    //   this.signupForm.get('password').value
    // );
  }

  ngOnDestroy() {
    this.signupFormClient.reset();
  }
}
