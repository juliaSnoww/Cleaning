import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {UserModel} from '../../shared/model/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ReserveService} from '../../shared/service/reserve.service';
import {OrderModel} from '../../shared/model/order.model';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements OnInit, OnDestroy {
  formOfOrder: FormGroup;
  user: UserModel;
  price;
  index;
  indexSubscription;
  ordersSubscription;
  activeInfo;
  @Input() item;

  constructor(private elementRef: ElementRef,
              private router: Router,
              private reserveService: ReserveService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.indexSubscription = this.route.params.subscribe(params => this.index = params['id']);
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
      }),
      price: new FormControl(null),
      statusInfo: new FormGroup({
        text: new FormControl(null),
        active: new FormControl(),
        status: new FormControl() // new confirm cancel
      })
    });
    this.ordersSubscription = this.reserveService.getOrder(this.index)
      .subscribe((order: OrderModel) => {
        this.price = order.price;
        let date = order.cleaningDate;
        if (date) date = date.split('T')[0];
        order.cleaningDate = date;

        this.formOfOrder.patchValue(order);
        this.activeInfo = order.statusInfo.active;
        //if (this.statusInfo === 'canceled')
      });
  }

  closeModalWindow(e, block) {
    if (!block.contains(e.target)) this.router.navigate(['../profile']);
  }

  ngOnDestroy() {
    this.indexSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
  }
}
