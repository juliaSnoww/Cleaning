import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from './user.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: UserModel;
  profileForm: FormGroup;
  passMatch = true;
  private userInfoSubscription;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.userInfoSubscription = this.authService.getJustUserInfo().subscribe(
      (response: UserModel) => {
        this.user = response;
        this.profileForm = this.fb.group({
          info: new FormGroup({
            name: new FormControl(this.user.name, Validators.required),
            email: new FormControl(this.user.email || 0, [Validators.required, Validators.email]),
            address: new FormControl(this.user.address || '55', Validators.required)
          }),
          pass: this.fb.group({
            oldPass: new FormControl(null, Validators.required),
            newPass: new FormControl(null, Validators.required),
            confirmPass: new FormControl(null, Validators.required)
          })
        });
      });
  }

  onSubmit() {
    const pristine = this.profileForm.controls.pass.pristine;
    if (this.profileForm.controls.pass.valid || pristine) {
      const pass = this.profileForm.get('pass.newPass').value;
      const passConfirm = this.profileForm.get('pass.confirmPass').value;
      if (pass !== passConfirm) {
        this.passMatch = false;
        this.authService.updateUserInfo(this.profileForm.value.info);
      } else if (pristine) {
        this.authService.updateUserInfo(this.profileForm.value.info);
      } else {
        this.authService.updateUserInfo(this.profileForm.value.info, this.profileForm.value.pass);
      }
    }
  }

  ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }
}
