import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  private form;

  constructor(private http: HttpClient) {
  }

  getReservationForm() {
    return this.form;
  }

  postReservationForm(form: FormGroup) {
    this.form = form;
    this.http.post('http://localhost:3000/api/service/book', form).subscribe(
      (response) => {
        console.log(response);
      });
  }
}
