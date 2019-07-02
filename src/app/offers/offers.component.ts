import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';

import {ReserveService} from '../shared/service/reserve.service';
import {CompanyService} from '../shared/service/company.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  private companyArray;
  private COMPANY;
  totalOffer = 10;
  currentPage = 1;
  offerPerPage = 2;
  pageSizeOpt = [2, 5, 10];

  constructor(private reserveService: ReserveService,
              private companyService: CompanyService,
              private router: Router) {
  }

  ngOnInit() {
    this.reserveService.getAllOffers().subscribe((res: Array<any>) => {
      this.COMPANY = res.sort((a, b) => {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      });
      this.companyArray = this.COMPANY.slice(0, this.offerPerPage);
      this.totalOffer = this.COMPANY.length;
    });
  }

  showCompany(item) {
    this.companyService.selectCompany(item);
    this.router.navigate(['/company-item', item.name]);
  }

  order(company) {
    this.companyService.selectCompany(company);
    this.router.navigate(['/reservation']);
  }

  sortBy(item: string) {
    item = (item === 'price') ? 'price' : (item === 'dst') ? 'distance' : 'company[rate]';
    console.log(item)
    if (item === 'price' || item === 'distance')
      this.COMPANY = this.COMPANY.sort((a, b) => {
        console.log(a[item]);
        if (a[item] > b[item]) return 1;
        if (a[item] < b[item]) return -1;
        return 0;
      });
    // if (item === 'dst')
    //   this.COMPANY = this.COMPANY.sort((a, b) => {
    //     if (a.company.address > b.company.rate) return 1;
    //     if (a.company.rate < b.company.rate) return -1;
    //     return 0;
    //   });
    else this.COMPANY = this.COMPANY.sort((a, b) => {
      if (a.company.rate > b.company.rate) return 1;
      if (a.company.rate < b.company.rate) return -1;
      return 0;
    });
    this.companyArray = this.COMPANY.slice(0, this.offerPerPage);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.offerPerPage = pageData.pageSize;
    this.companyArray = this.COMPANY.slice((this.currentPage - 1) * this.offerPerPage, this.currentPage * this.offerPerPage);
  }
}
