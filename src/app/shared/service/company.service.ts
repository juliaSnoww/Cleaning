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

  getCompanies(pageSize: number, currentPage: number) {
    const queryParams = `currentPage=${currentPage}&pageSize=${pageSize}`;
    return this.http.get('http://localhost:3000/api/company/get-all-company?' + queryParams);
  }

  getCompaniesByType(item: string) {
    const queryParams = `searchType=type&searchItem=${item}`;
    return this.http.get('http://localhost:3000/api/company/get-companies-by?' + queryParams);
  }

  getCompaniesByName(item: string) {
    const queryParams = `searchType=name&searchItem=${item}`;
    return this.http.get('http://localhost:3000/api/company/get-companies-by?' + queryParams);
  }

  selectCompany(company) {
    this.isCompanySelected = true;
    this.selectedCompany = company;
  }

  getCompanySelectedStatus() {
    return this.isCompanySelected;
  }

  getSelectedCompany() {
    return this.selectedCompany;
  }

  getProfileCompany(name) {
    return this.http.get('http://localhost:3000/api/company/get-company?name=' + name);
  }

  postComment(data) {
    this.http.post('http://localhost:3000/api/comments/add-comment', data)
      .subscribe(res => console.log(res));
  }

  getComments(companyId) {
    return this.http.get('http://localhost:3000/api/comments/comments?companyId=' + companyId);
  }

  onUnselectedCompany() {
    this.isCompanySelected = false;
    this.selectedCompany = null;
  }
}
