import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {ReserveService} from '../shared/service/reserve.service';
import {CompanyService} from '../shared/service/company.service';
import {AuthService} from '../shared/service/auth.service';
import {ReservationModel} from '../shared/model/reservation.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {
  reservationForm: FormGroup;
  emptyField = false;
  isAuth: boolean;
  isCompanySelected: boolean;
  companySelected;
  companySelectedName: string;
  userInfoSubscription;
  timeArray = [
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00'
  ];

  regularityArray = [
    {value: 'one', display: 'One time'},
    {value: 'week', display: 'Every week'},
    {value: 'twoWeek', display: 'Every 2 weeks'},
    {value: 'month', display: 'Every month'}
  ];

  cleaningTypeArray = [
    {value: 'standard', display: 'Standard', img: './assets/type cleaning/color/1sweep.svg'},
    {value: 'general', display: 'General', img: './assets/type cleaning/color/1washbowl.svg'},
    {value: 'afterRenovation', display: 'Renovation', img: './assets/type cleaning/color/1hammer.svg'},
    {value: 'carpetCleaning', display: 'Carpet', img: './assets/type cleaning/color/1rug.svg'},
    {value: 'officeCleaning', display: 'Office', img: './assets/type cleaning/color/1desk.svg'},
    {value: 'furnitureCleaning', display: 'Furniture', img: './assets/type cleaning/color/1sofa.svg'},
    {value: 'industrialCleaning', display: 'Industrial', img: './assets/type cleaning/color/floor.svg'},
    {value: 'poolCleaning', display: 'Pool', img: './assets/type cleaning/color/1pool.svg'}
  ];

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private authService: AuthService,
              private reserveService: ReserveService,
              private companyService: CompanyService,
              private router: Router) {
  }

  ngOnInit() {
    this.reservationForm = this.fb.group({
      date: new FormControl(null, Validators.required),
      time: new FormControl(this.timeArray[2], Validators.required),
      regularity: new FormControl(this.regularityArray[1].value, Validators.required),
      cleaningType: new FormControl(null, Validators.required),
      apartmentDescription: new FormGroup({
        countOfBath: new FormControl(null, Validators.required),
        countOfStandardRoom: new FormControl(null, Validators.required),
        countOfLargeRoom: new FormControl(null, Validators.required),
      }),
      cleaningServiceInfo: {
        name: new FormControl(null, Validators.required),
        cleaningService_id: new FormControl(null)
      },
      address: new FormControl(null, Validators.required),
      userInfo: new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        userId: new FormControl(null)
      })
    });

    const form = this.reserveService.getReservationForm();
    if (form) this.reservationForm.patchValue(form);

    this.isAuth = this.authService.getIsAuth();
    if (this.isAuth) {
      this.userInfoSubscription = this.authService.getJustUserInfo()
        .subscribe((res: ReservationModel) => {
          const tempForm = res.reservationInfo;
          this.reservationForm
            .patchValue({
              apartmentDescription: tempForm.apartmentDescription,
              cleaningType: tempForm.cleaningType,
              regularity: tempForm.regularity,
              address: tempForm.address
            });
          this.reservationForm.controls.userInfo
            .patchValue({email: res.userInfo.email});
          this.saveForm();
        });
    }

    this.isCompanySelected = this.companyService.getCompanySelectedStatus();
    if (this.isCompanySelected) this.companyWasSelected();
  }

  saveForm() {
    this.reserveService.saveForm(this.reservationForm.value);
  }

  private companyWasSelected() {
    this.companySelected = this.companyService.getSelectedCompany();
    let typeThisCompany;

    if (this.companySelected.company) {
      typeThisCompany = this.companySelected.company.costPerUnit.type;
      this.companySelectedName = this.companySelected.name;
      this.reservationForm.controls
        .cleaningServiceInfo
        .patchValue({
          name: this.companySelected.name,
          cleaningService_id: this.companySelected._id
        });
    } else {
      typeThisCompany = this.companySelected.costPerUnit.type;
      this.companySelectedName = this.companySelected.cleaningServiceInfo.name;
      this.reservationForm.controls
        .cleaningServiceInfo
        .patchValue({
          name: this.companySelected.cleaningServiceInfo.name,
          cleaningService_id: this.companySelected.cleaningServiceInfo.cleaningService_id
        });
    }
    this.cleaningTypeArray = this.cleaningTypeArray
      .filter((el) => el.value in typeThisCompany);
  }

  onSubmit() {
    if (this.companySelected.company) {
      this.reservationForm.controls
        .cleaningServiceInfo
        .patchValue({
          name: this.companySelected.name,
          cleaningService_id: this.companySelected._id
        });
    } else {
      this.reservationForm.controls
        .cleaningServiceInfo
        .patchValue({
          name: this.companySelected.cleaningServiceInfo.name,
          cleaningService_id: this.companySelected.cleaningServiceInfo.cleaningService_id
        });
    }
    if (this.reservationForm.valid) {
      this.reserveService.saveForm(this.reservationForm.value);
      this.reserveService.calculatePrice(this.reservationForm.value);
      this.router.navigate(['/reservation', {outlets: {modal: ['submit']}}]);
    } else {
      this.emptyField = true;
      return;
    }
  }

  showOffers() {
    this.reservationForm.controls.cleaningServiceInfo.setValue(null);
    if (this.reservationForm.valid) {
      this.saveForm();
      this.router.navigate(['/offers']);
    } else {
      this.emptyField = true;
      return;
    }
  }

  ngOnDestroy() {
    if (this.isAuth) this.userInfoSubscription.unsubscribe();
    if (this.isCompanySelected) {
      this.companyService.onUnselectedCompany();
    }
  }

}
