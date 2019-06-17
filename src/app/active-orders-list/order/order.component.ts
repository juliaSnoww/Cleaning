import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ReserveService} from '../../shared/service/reserve.service';
import {OrderModel} from '../../shared/model/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  formOfOrder: FormGroup;
  price;
  index;
  indexSubscription;
  ordersSubscription;
  statusInfo;
  isApprovedCancel = false;
  textValue;
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
        active: new FormControl(),
        status: new FormControl() // new confirm cancel
      })
    });
    this.ordersSubscription = this.reserveService
      .getOrder(this.index).subscribe((order: OrderModel | any) => {
        this.price = order.price;
        let date = order.cleaningDate;
        if (date) date = date.split('T')[0];
        order.cleaningDate = date;

        this.formOfOrder.patchValue(order);
        this.statusInfo = order.statusInfo.status;
      });
  }

  closeModalWindow(e, block) {
    if (!block.contains(e.target)) this.router.navigate(['./active-order-list']);
  }

  ngOnDestroy() {
    this.indexSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
  }

  submitOrder() {
    this.reserveService.submitOrder(this.index);
    this.router.navigate(['./active-order-list']);
  }

  cancelOrder(reason: ElementRef) {
    this.isApprovedCancel = true;
    if (reason) {
      this.reserveService.cancelOrder(this.index, reason);
      this.router.navigate(['./active-order-list']);
    }
  }
}
