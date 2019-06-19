import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../shared/service/company.service';
import {Company} from '../shared/model/company.model';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  private companies: object;
  private COMPANY;
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
    this.companyService.getCompanies().subscribe(
      (res: Company) => {
        this.COMPANY = res.company;
        this.companies = this.COMPANY;
      }
    );
  }

  searchByName() {
    this.type = this.cleaningTypeArray[0].value;
    this.companies = this.COMPANY.filter((el) => {
      if (!el.name) return false;
      return !el.name.indexOf(this.nameForm.value.name);
    });
  }

  searchByType(value) {
    if (value === 'all') {
      this.companies = this.COMPANY;
    } else {
      this.companies = this.COMPANY.filter((el) => {
        return this.type in el.company.costPerUnit.type;
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

}
