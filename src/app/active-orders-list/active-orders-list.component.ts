import {Component, OnInit} from '@angular/core';
import {ReserveService} from '../shared/service/reserve.service';

@Component({
  selector: 'app-active-orders-list',
  templateUrl: './active-orders-list.component.html',
  styleUrls: ['./active-orders-list.component.scss']
})
export class ActiveOrdersListComponent implements OnInit {
  allOrders;

  constructor(private reserveService: ReserveService) {
  }

  ngOnInit() {
    this.reserveService.getActiveOrdersOfCompany()
      .subscribe(res => this.allOrders = res);
  }

}
