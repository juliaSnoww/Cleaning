import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl('jul', Validators.required),
      email: new FormControl('test@mail.ru', [Validators.required, Validators.email]),
      password: new FormControl('123', Validators.required),
      submitPsw: new FormControl('123', Validators.required)
    });
  }

  onSubmit() {
    this.authService.createUser(
      this.signupForm.get('username').value,
      this.signupForm.get('email').value,
      this.signupForm.get('password').value
    );
  }

}
