import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {UserModel} from '../../shared/model/user.model';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements OnInit {
  formOfOrder: FormGroup;
  user: UserModel;
  @Input() item;

  constructor() {
  }

  ngOnInit() {
    this.formOfOrder = new FormGroup({
      cleaningDate: new FormControl(),
      preferredTime: new FormControl(),
      regularity: new FormControl(),
      cleaningType: new FormControl(),
      apartmentDescription: new FormGroup({
        countOfBath: new FormControl(),
        countOfStandardRoom: new FormControl(),
        countOfLargeRoom: new FormControl(),
      }),
      cleaningServiceInfo: new FormGroup({
        name: new FormControl(),
      }),
      address: new FormControl(),
      userInfo: new FormGroup({
        email: new FormControl(),
      })
    });
    let date = this.item.cleaningDate;
    date = date.split('T')[0];
    this.item.cleaningDate = date;
    this.formOfOrder.patchValue(this.item);
  }

}
