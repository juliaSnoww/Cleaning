import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {AuthData} from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject();

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  createUser(username: string, email: string, password: string) {
    const authData: AuthData = {username, email, password};
    // console.log(authData);
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
       // console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData = {email, password};
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.isAuthenticated = true;
        this.token = response.token;
        this.authStatusListener.next(true);
        this.saveAuthData(this.token);
        this.router.navigate(['/']);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string) {
    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return {token};
  }
}
