import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrls: ['./signup-client.component.scss']
})
export class SignupClientComponent implements OnInit, OnDestroy {
  signupFormClient: FormGroup;
  passMatch = true;

  constructor(private authService: AuthService) {
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
    this.authService.createUser(this.signupFormClient.value);
  }

  ngOnDestroy() {
    this.signupFormClient.reset();
  }
}
