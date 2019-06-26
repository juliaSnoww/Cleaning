import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../shared/service/company.service';
import {Company} from '../shared/model/company.model';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  private companies: object;
  totalPost = 10;
  currentPage = 1;
  postPerPage = 10;
  pageSizeOpt = [2, 5, 10];
  name;
  nameForm;
  cleaningTypeArray = [
    {value: 'all', display: 'type'},
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
    this.nameForm = new FormGroup({
      name: new FormControl('')
    });
    this.companyService.getCompanies(this.postPerPage, 1).subscribe(
      (res: Company) => {
        this.totalPost = res.maxCompany;
        this.companies = res.company;
      }
    );
  }

  searchByName() {
    this.type = this.cleaningTypeArray[0].value;
    this.companyService.getCompaniesByName(this.nameForm.value.name).subscribe((foundCompanies: Array<any>) => {
      this.companies = foundCompanies;
      this.totalPost = foundCompanies.length;
    });
  }

  searchByType(value) {
    if (value === 'all') {
      this.companyService.getCompanies(this.postPerPage, 1).subscribe(
        (res: Company) => {
          this.totalPost = res.maxCompany;
          this.companies = res.company;
        }
      );
    } else {
      this.companyService.getCompaniesByType(value).subscribe((foundCompanies: Array<any>) => {
        this.companies = foundCompanies;
        this.totalPost = foundCompanies.length;
      });
    }
    this.nameForm.reset();
  }

  order(company) {
    this.companyService.selectCompany(company);
    this.router.navigate(['/reservation']);
  }

  showCompany(company) {
    this.companyService.selectCompany(company);
    this.router.navigate(['/company-item', company.name]);
  }

  returnBack(e, block) {
    if (!block.contains(e.target)) this.router.navigate(['/']);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.companyService.getCompanies(this.postPerPage, this.currentPage).subscribe(
      (res: Company) => {
        this.companies = res.company;
      }
    );
  }

}
