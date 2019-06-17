import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/service/auth.service';


@Component({
  selector: 'app-mini-reserve-history',
  templateUrl: './mini-reserve-history.component.html',
  styleUrls: ['./mini-reserve-history.component.scss']
})
export class MiniReserveHistoryComponent implements OnInit {
  statusInfo;
  activeInfo;
  reserveInfo;
  isClient;
  @Input() item;

  constructor(private authService: AuthService) {
    this.isClient = this.authService.isClientType();
  }

  ngOnInit() {
    let {preferredTime: time, cleaningDate: date, cleaningType: type} = this.item;
    if (date) date = date.split('T')[0];
    this.reserveInfo = {
      date,
      time,
      type
    };
    this.activeInfo = this.item.statusInfo.active;
    this.statusInfo = this.item.statusInfo.status;
  }
}
