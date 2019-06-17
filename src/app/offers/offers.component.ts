import {Component, OnInit} from '@angular/core';
import {ReserveService} from '../shared/service/reserve.service';
import {CompanyService} from '../shared/service/company.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  private companyArray;

  constructor(private reserveService: ReserveService,
              private companyService: CompanyService,
              private router: Router) {
  }

  ngOnInit() {
    this.reserveService.getAllOffers().subscribe(res => {
      this.companyArray = res;
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
}
