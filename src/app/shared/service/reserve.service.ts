import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  private form;
  private price;

  constructor(private http: HttpClient) {
  }

  isHasReserve() {
    return !!this.form;
  }

  getPrice() {
    return this.price;
  }

  getReservationForm() {
    return this.form;
  }

  getAllOrders() {
    return this.http.get('http://localhost:3000/api/service/orders');
  }

  getOrder(id) {
    return this.http.get('http://localhost:3000/api/service/order?id=' + id);
  }

  getActiveOrdersOfCompany() {
    return this.http.get('http://localhost:3000/api/company/orders');
  }

  cancelOrder(idOrder, reason) {
    this.http.put('http://localhost:3000/api/service/order', {idOrder, status: 'canceled', reason})
      .subscribe(res => console.log(res));
  }

  submitOrder(idOrder) {
    this.http.put('http://localhost:3000/api/service/order', {idOrder, status: 'submitted'})
      .subscribe(res => console.log(res));
  }

  getAllOffers(sortItem = 'price') {
    const params = new HttpParams()
      .set('bath', this.form.apartmentDescription.countOfBath)
      .set('standard', this.form.apartmentDescription.countOfStandardRoom)
      .set('large', this.form.apartmentDescription.countOfLargeRoom)
      .set('type', this.form.cleaningType)
      .set('sortItem', sortItem)
      .set('address', this.form.address);
    return this.http.get('http://localhost:3000/api/service/offers', {params});
  }

  saveForm(form) {
    this.form = form;
  }

  deleteForm() {
    this.form = null;
  }

  postReservationForm(form) {
    this.http.post('http://localhost:3000/api/service/book', form).subscribe(
      (response) => {
        console.log(response);
      });
  }

  calculatePrice(form) {
    const {apartmentDescription, cleaningType, cleaningServiceInfo} = form;
    const dateForCost = {
      apartmentDescription,
      cleaningType,
      cleaningServiceInfo
    };
    this.http.post('http://localhost:3000/api/service/price', dateForCost)
      .subscribe(res => this.price = res);
  }

}
