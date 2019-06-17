import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {CookieService} from 'ngx-cookie-service';
import {ReserveService} from './reserve.service';
import {CompanyService} from './company.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cookie: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject();
  private clientTypeListener = new Subject();
  private isClient: boolean;
  private isAdminStatus = new Subject();
  private isAdmin;
  private msgBlocked = new Subject();

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              private reserveService: ReserveService,
              private companyService: CompanyService) {
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdminListener() {
    return this.isAdminStatus.asObservable();
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getClientTypeStatus() {
    return this.clientTypeListener.asObservable();
  }

  isClientType() {
    return this.isClient;
  }

  getJustUserInfo() {
    return this.http.get('http://localhost:3000/api/user/profile');
  }

  getCompanyInfo() {
    return this.http.get('http://localhost:3000/api/company/profile');
  }

  updateUserInfo(userInfo) {
    this.http.put('http://localhost:3000/api/user/login/info', userInfo)
      .subscribe(response => {
        console.log(response);
      });
  }

  updateCompanyInfo(companyInfo) {
    console.log(companyInfo);
    this.http.put('http://localhost:3000/api/company/login/info', companyInfo)
      .subscribe(response => {
        console.log(response);
      });
  }

  updatePsw(oldPsw, newPsw) {
    return this.http.put('http://localhost:3000/api/user/login/pass', {oldPsw, newPsw});
  }

  createUser(authData) {
    return this.http.post('http://localhost:3000/api/user/signup', authData);
  }

  createCompany(form) {
    this.http.post('http://localhost:3000/api/company/signup', form)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['/']);
      });
  }

  loginCompany(authData) {
    this.http.post('http://localhost:3000/api/user/login', authData)
      .subscribe((response: { msg: string, type: string }) => {
        if (response.msg === 'ok') {
          this.isClient = false;
          this.isAuthenticated = true;
          this.cookie = this.cookieService.get('connect.sid');
          this.cookieService.set('type', 'company');
          this.authStatusListener.next(true);
          this.clientTypeListener.next(false);
          this.router.navigate(['/active-order-list']);
        }
        else {
          this.msgBlocked.next(response.msg);
        }
      });
  }

  login(authData) {
    this.http.post('http://localhost:3000/api/user/login', authData)
      .subscribe((response: { msg: string, type: string }) => {
        console.log(response);
        if (response.msg === 'ok') {
          if (response.type === 'admin') {
            this.isAdminStatus.next(true);
            this.isAdmin = true;
            this.cookieService.deleteAll();
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['admin/customer']);
          } else {
            this.isClient = true;
            this.isAuthenticated = true;
            this.cookie = this.cookieService.get('connect.sid');
            this.cookieService.set('type', 'client');
            this.authStatusListener.next(true);
            this.clientTypeListener.next(true);
            this.router.navigate(['/']);
          }
        }
        else {
          console.log(response.msg);
          this.msgBlocked.next(response.msg);
        }
      });
  }

  getMsgError() {
    return this.msgBlocked.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.cookie = this.cookieService.get('connect.sid');
    this.isClient = (this.cookieService.get('type') === 'client');
    this.clientTypeListener.next(this.isClient);
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  logout() {
    this.cookieService.deleteAll();
    this.isAuthenticated = false;
    this.isClient = false;
    this.isAdmin = false;
    this.isAdminStatus.next(false);
    this.reserveService.deleteForm();
    this.companyService.onUnselectedCompany();
    this.authStatusListener.next(false);
    this.clientTypeListener.next(true);
    this.clearAuthData();
    this.router.navigate(['/main']);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const cookie = this.cookieService.get('connect.sid');
    if (!cookie) {
      return;
    }
    return {cookie};
  }

}
