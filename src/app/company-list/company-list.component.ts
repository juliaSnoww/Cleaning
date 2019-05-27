import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../shared/service/company.service';
import {Company} from './company.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  private companies: object;
  private COMPANY;
  name;
  cleaningTypeArray = [
    {value: 'all', display: 'All type'},
    {value: 'standard', display: 'Standard'},
    {value: 'general', display: 'General'},
    {value: 'afterConstruction', display: 'Renovation'},
    {value: 'carpetCleaning', display: 'Carpet'},
    {value: 'officeCleaning', display: 'Office'},
    {value: 'furnitureCleaning', display: 'Furniture'},
    {value: 'industrialCleaning', display: 'Industrial'},
    {value: 'poolCleaning', display: 'Pool'}
  ];
  type = this.cleaningTypeArray[0].value;

  constructor(private http: HttpClient,
              private companyService: CompanyService,
              private router: Router) {
  }

  ngOnInit() {
    this.companyService.getCompanies().subscribe(
      (res: Company) => {
        this.COMPANY = res.company;
        this.companies = this.COMPANY;
      }
    );
  }

  searchByName() {
    this.companies = this.COMPANY.filter((el) => !el.name.indexOf(this.name));
  }

  searchByType(value) {
    if (value === 'all') {
      this.companies = this.COMPANY;
    } else {
      this.companies = this.COMPANY.filter((el) => {
        return this.type in el.company.costPerUnit.type;
      });
    }
  }

  order(company) {
    this.companyService.selectCompany(company);
    this.router.navigate(['/reservation']);
  }

}
