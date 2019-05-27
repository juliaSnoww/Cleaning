import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {ReserveService} from '../../shared/service/reserve.service';
import {AuthService} from '../../shared/service/auth.service';
import {UserModel} from '../../profile/user.model';
import {CompanyService} from '../../shared/service/company.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-reservation-submit',
  exportAs: 'modal',
  templateUrl: './reservation-submit.component.html',
  styleUrls: ['./reservation-submit.component.scss']
})
export class ReservationSubmitComponent implements OnInit, OnDestroy {
  formSubmitted: FormGroup;
  isAuth: boolean;
  user: UserModel;
  isCompanySelected: boolean;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private reserveService: ReserveService,
              private companyService: CompanyService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.isCompanySelected = this.companyService.getCompanySelectedStatus();
    this.isAuth = this.authService.getIsAuth();

    const form = this.reserveService.getReservationForm();
    this.formSubmitted = this.fb.group({
      date: new FormControl(),
      time: new FormControl(),
      regularity: new FormControl(),
      cleaningType: new FormControl(),
      apartmentDescription: new FormGroup({
        countOfBath: new FormControl(),
        countOfStandardRoom: new FormControl(),
        countOfLargeRoom: new FormControl(),
      }),
      cleaningServiceInfo: new FormGroup({
        name: new FormControl(),
        cleaningService_id: new FormControl()
      }),
      address: new FormControl(),
      userInfo: new FormGroup({
        email: new FormControl(),
        userId: new FormControl()
      })
    });
    if (form) this.formSubmitted.setValue(form);
    if (this.isAuth) {
      this.user = this.authService.getUserInfo();
      this.formSubmitted.controls
        .userInfo
        .patchValue({
          email: this.user.email,
        });
    }
  }

  onSubmit() {
    this.reserveService.postReservationForm(this.formSubmitted.value);
  }

  ngOnDestroy() {

  }

}
