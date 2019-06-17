import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {
  }

  getClients() {
    return this.http.get('http://localhost:3000/api/admin/clients');
  }

  getCompanies() {
    return this.http.get('http://localhost:3000/api/admin/company');
  }

  blockUser(id, reason) {
   return this.http.post('http://localhost:3000/api/admin/block', {id, reason});
  }
  unblockUser(id) {
   return this.http.post('http://localhost:3000/api/admin/unblock', {id});
  }
}
