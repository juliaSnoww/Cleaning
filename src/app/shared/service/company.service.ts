import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private selectedCompany;
  private isCompanySelected = false;

  constructor(private http: HttpClient) {

  }

  getCompanies() {
    return this.http.get('http://localhost:3000/api/company/get-all-company');
  }

  selectCompany(company) {
    this.isCompanySelected = !this.isCompanySelected;
    this.selectedCompany = company;
  }

  getCompanySelectedStatus() {
    return this.isCompanySelected;
  }

  getSelectedCompany() {
    return this.selectedCompany;
  }

}
