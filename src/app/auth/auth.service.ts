import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthData} from './auth.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject();

  constructor(private http: HttpClient) {
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  createUser(username: string, email: string, password: string) {
    const authData: AuthData = {username, email, password};
    console.log(authData);
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(username: string, email: string, password: string) {
    const authData: AuthData = {username, email, password};
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
        console.log(response);
        this.authStatusListener.next(true);
      });
  }

}




