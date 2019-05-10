import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from './user.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserModel;
  profileForm: FormGroup;

  constructor(private http: HttpClient,
              private cookie: CookieService) {
  }

  ngOnInit() {
    this.http.get('http://localhost:3000/api/user/login').subscribe(
      (response: UserModel) => {
        this.user = response;
        this.profileForm = new FormGroup({
          username: new FormControl(this.user.username, Validators.required),
          email: new FormControl(this.user.email, [Validators.required, Validators.email]),
          address: new FormControl(this.user.address || '55', Validators.required)
        });
      }
    );
  }

  onSubmit() {
    this.http.put('http://localhost:3000/api/user/login', this.profileForm.value).subscribe(
      (response) => {
        console.log(response);
      }
    );
    console.log(this.profileForm.pristine);
  }
}
