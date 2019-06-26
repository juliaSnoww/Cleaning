import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from '../../shared/service/admin.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  private CUSTOMER = [];
  customerArray = [];
  userPath;
  totalOffer = 10;
  currentPage = 1;
  offerPerPage = 2;
  pageSizeOpt = [2, 5, 10];

  constructor(private http: HttpClient,
              private router: ActivatedRoute,
              private adminService: AdminService) {
  }

  ngOnInit() {
    this.userPath = this.router.snapshot.routeConfig.path;
    if (this.userPath === 'customer')
      this.adminService.getClients().subscribe((res: Array<object>) => {
        this.CUSTOMER = res;
        this.customerArray = this.CUSTOMER.slice(0, this.offerPerPage);
        this.totalOffer = this.CUSTOMER.length;
      });
    else this.adminService.getCompanies().subscribe((res: Array<object>) => {
      this.customerArray = res;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.offerPerPage = pageData.pageSize;
    this.customerArray = this.CUSTOMER.slice((this.currentPage - 1) * this.offerPerPage, this.currentPage * this.offerPerPage);
  }

}
