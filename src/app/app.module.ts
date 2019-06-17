import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthInterceptor} from './auth/auth.interceptor';
import {SignupClientComponent} from './auth/signup/signup-client/signup-client.component';
import {SignupCompanyComponent} from './auth/signup/signup-company/signup-company.component';
import {ServiceTypesComponent} from './auth/signup/signup-company/service-types/service-types.component';
import {CookieService} from 'ngx-cookie-service';
import {ReservationComponent} from './reservation/reservation.component';
import {CompanyListComponent} from './company-list/company-list.component';
import {CompanyItemComponent} from './company-list/company-item/company-item.component';
import {ReservationSubmitComponent} from './reservation/reservation-submit/reservation-submit.component';
import { ReservationHistoryComponent } from './profile/reservation-history/reservation-history.component';
import { MiniReserveHistoryComponent } from './profile/mini-reserve-history/mini-reserve-history.component';
import { CommentsComponent } from './comments/comments.component';
import { OffersComponent } from './offers/offers.component';
import { CompanyComponent } from './profile/company/company.component';
import { ActiveOrdersListComponent } from './active-orders-list/active-orders-list.component';
import { OrderComponent } from './active-orders-list/order/order.component';
import { CustomerComponent } from './admin/customer/customer.component';
import { UserItemComponent } from './admin/user-item/user-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    ProfileComponent,
    SignupClientComponent,
    SignupCompanyComponent,
    ServiceTypesComponent,
    ReservationComponent,
    CompanyListComponent,
    CompanyItemComponent,
    ReservationSubmitComponent,
    ReservationHistoryComponent,
    MiniReserveHistoryComponent,
    CommentsComponent,
    OffersComponent,
    CompanyComponent,
    ActiveOrdersListComponent,
    OrderComponent,
    CustomerComponent,
    UserItemComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  entryComponents: [
    ReservationSubmitComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
