import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ReserveService} from './reserve.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  reservationForm: FormGroup;
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
              private reserveService: ReserveService) {
  }

  ngOnInit() {
    const form = this.reserveService.getReservationForm();

    this.reservationForm = this.fb.group({
      date: new FormControl(null, Validators.required),
      time: new FormControl(this.timeArray[2], Validators.required),
      regularity: new FormControl(this.regularityArray[1].value, Validators.required),
      cleaningType: new FormControl(null, Validators.required),
      apartmentDescription: new FormGroup({
        countOfBath: new FormControl(1, Validators.required),
        countOfStandardRoom: new FormControl(2, Validators.required),
        countOfLargeRoom: new FormControl(1, Validators.required),
      }),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    if (form) this.reservationForm.setValue(form);

  }

  onSubmit() {
    this.reserveService.postReservationForm(this.reservationForm.value);
  }

}
