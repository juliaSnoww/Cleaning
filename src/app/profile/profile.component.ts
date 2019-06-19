import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {ReservationModel} from '../shared/model/reservation.model';
import {UserModel} from '../shared/model/user.model';
import {AuthService} from '../shared/service/auth.service';
import {ReserveService} from '../shared/service/reserve.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: UserModel;
  profileForm: FormGroup;
  passMatch = true;
  isChangePsw = false;
  isShowOrder = false;
  msgError: string;
  allOrders;
  imageUrl;
  private userInfoSubscription;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private fb: FormBuilder,
              private reserveService: ReserveService) {
  }

  ngOnInit() {
    this.userInfoSubscription = this.authService.getJustUserInfo().subscribe(
      (response: ReservationModel) => {
        this.user = response.userInfo;
        this.imageUrl = this.user.imagePath || null;
        console.log(response);
        this.profileForm = this.fb.group({
          info: new FormGroup({
            imagePath: new FormControl(this.imageUrl),
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
    this.reserveService.getAllOrders()
      .subscribe(res => this.allOrders = res);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.profileForm.get('info').patchValue({imagePath: file});
    this.profileForm.get('info').get('imagePath').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.profileForm.controls.info.valid)
      this.authService.updateUserInfo(this.profileForm.value.info);
  }

  showAllOrders() {
    this.isShowOrder = !this.isShowOrder;
  }

  changePsw() {
    this.isChangePsw = !this.isChangePsw;
    if (!this.isChangePsw) this.profileForm.controls.pass.reset();
  }

  savePsw() {
    if (this.profileForm.controls.pass.pristine) {
      this.isChangePsw = !this.isChangePsw;
    }
    if (this.profileForm.controls.pass.valid) {
      const oldPsw = this.profileForm.get('pass.oldPass').value;
      const psw = this.profileForm.get('pass.newPass').value;
      const pswConfirm = this.profileForm.get('pass.confirmPass').value;
      if (psw !== pswConfirm) {
        this.passMatch = false;
      } else {
        this.authService.updatePsw(oldPsw, psw).subscribe((response: { msg: string }) => {
          this.msgError = response.msg;
        });
      }
    }
  }

  returnBack(e, block) {
    if (!block.contains(e.target)) this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }

}
