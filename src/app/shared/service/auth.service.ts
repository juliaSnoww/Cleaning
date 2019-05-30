import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {CookieService} from 'ngx-cookie-service';
import {UserModel} from '../model/user.model';
import {ReserveService} from './reserve.service';
import {CompanyService} from './company.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cookie: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject();
  private customerInfo = new Subject();

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              private reserveService: ReserveService,
              private companyService: CompanyService) {
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getUserInfo() {
    return this.customerInfo.asObservable();
  }

  getJustUserInfo() {
    return this.http.get('http://localhost:3000/api/user/profile');
  }

  updateUserInfo(userInfo, pass = null) {
    if (pass) {
      this.http.put('http://localhost:3000/api/user/login/pass', {userInfo, pass})
        .subscribe(response => {
          console.log(response);
        });
    } else {
      this.http.put('http://localhost:3000/api/user/login/info', userInfo)
        .subscribe(response => {
          console.log(response);
        });
    }
  }

  getUserInfoQuery() {
    this.http.get('http://localhost:3000/api/user/profile').subscribe(
      (response: UserModel) => {
        this.customerInfo.next(response);
      });
  }

  createUser(authData) {
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  createCompany(form) {
    this.http.post('http://localhost:3000/api/company/signup', form)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  loginCompany(authData) {
    this.http.post<{ token: string }>('http://localhost:3000/api/company/login', authData)
      .subscribe(response => {
        this.isAuthenticated = true;
        this.cookie = this.cookieService.get('connect.sid');
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      });
  }

  login(authData) {
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.isAuthenticated = true;
        this.cookie = this.cookieService.get('connect.sid');
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
     //   this.reserveService.getReservationForm();
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.cookie = this.cookieService.get('connect.sid');
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  logout() {
    this.cookieService.deleteAll();
    this.isAuthenticated = false;
    this.reserveService.deleteForm();
    this.companyService.onUnselectedCompany();
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
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
