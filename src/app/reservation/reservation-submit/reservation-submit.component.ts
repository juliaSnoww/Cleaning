import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {ReserveService} from '../../shared/service/reserve.service';
import {AuthService} from '../../shared/service/auth.service';
import {UserModel} from '../../shared/model/user.model';
import {CompanyService} from '../../shared/service/company.service';


@Component({
  selector: 'app-reservation-submit',
  templateUrl: './reservation-submit.component.html',
  styleUrls: ['./reservation-submit.component.scss']
})
export class ReservationSubmitComponent implements OnInit, AfterContentChecked {
  formSubmitted: FormGroup;
  price: number;
  isAuth: boolean;
  user: UserModel;


  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private reserveService: ReserveService,
              private companyService: CompanyService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
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
      }),
      price: new FormControl()
    });
    if (form) this.formSubmitted.patchValue(form);
  }

  ngAfterContentChecked() {
    this.price = this.reserveService.getPrice();
    this.formSubmitted.controls.price.patchValue(this.price);
  }

  closeModalWindow(e, block) {
    if (!block.contains(e.target)) this.router.navigate(['/reservation']);
  }

  onSubmit() {
    this.reserveService.postReservationForm(this.formSubmitted.value);
    this.router.navigate(['/']);
  }

}
