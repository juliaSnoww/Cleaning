import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {AuthData} from './auth.model';
import {CookieService} from 'ngx-cookie-service';
import {UserModel} from '../profile/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cookie: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject();
  private userInfo = new Subject();

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService) {
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getUserInfo() {
    this.http.get('http://localhost:3000/api/user/login').subscribe(
      (response: UserModel) => {
        this.userInfo.next(response);
      });
    return this.userInfo.asObservable();
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

  createUser(username: string, email: string, password: string) {
    const authData: AuthData = {username, email, password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  createCompany(form) {
    this.http.post('http://localhost:3000/api/company/signup', form)
      .subscribe(res => {
        console.log(res);
      });
  }

  loginCompany(authData) {
    this.http.post<{ token: string }>('http://localhost:3000/api/company/login', authData)
      .subscribe(response => {
        // this.isAuthenticated = true;
        this.cookie = this.cookieService.get('connect.sid');
       // this.authStatusListener.next(true);
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
