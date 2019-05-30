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

  isHasReserve() {
    return !!this.form;
  }

  getReservationForm() {
    return this.form;
  }

  getAllOrders() {
    return this.http.get('http://localhost:3000/api/service/orders');
  }

  saveForm(form) {
    this.form = form;
  }

  deleteForm() {
    this.form = null;
  }

  postReservationForm(form) {
    console.log(form);
    // this.http.post('http://localhost:3000/api/service/book', form).subscribe(
    //   (response) => {
    //     console.log(response);
    //   });
  }
}
