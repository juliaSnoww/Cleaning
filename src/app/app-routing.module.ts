import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthClientGuard} from './shared/guard/auth-client.guard';

import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {ProfileComponent} from './profile/profile.component';
import {SignupClientComponent} from './auth/signup/signup-client/signup-client.component';
import {SignupCompanyComponent} from './auth/signup/signup-company/signup-company.component';
import {ReservationComponent} from './reservation/reservation.component';
import {CompanyListComponent} from './company-list/company-list.component';
import {ReservationSubmitComponent} from './reservation/reservation-submit/reservation-submit.component';
import {ReservationHistoryComponent} from './profile/reservation-history/reservation-history.component';
import {CompanyItemComponent} from './company-list/company-item/company-item.component';
import {OffersComponent} from './offers/offers.component';
import {ActiveOrdersListComponent} from './active-orders-list/active-orders-list.component';
import {OrderComponent} from './active-orders-list/order/order.component';

import {ReserveGuard} from './shared/guard/reserve.guard';
import {CompanyGuard} from './shared/guard/company.guard';
import {AuthCompanyGuard} from './shared/guard/auth-company.guard';
import {CompanyComponent} from './profile/company/company.component';
import {CustomerComponent} from './admin/customer/customer.component';
import {AdminGuard} from './shared/guard/admin.guard';

const routes: Routes = [
  {path: '', redirectTo: '/active-order-list', pathMatch: 'full'},
  {path: 'main', component: ReservationComponent},
  {
    path: 'active-order-list', component: ActiveOrdersListComponent, canActivate: [AuthCompanyGuard],
    children: [
      {path: 'order/:id', component: OrderComponent, outlet: 'modal'}
    ]
  },
  {path: 'login', component: LoginComponent},
  {
    path: 'signup', component: SignupComponent, children: [
      {path: 'client', component: SignupClientComponent},
      {path: 'company', component: SignupCompanyComponent}
    ]
  },
  {
    path: 'admin', children: [
      {path: 'customer', component: CustomerComponent, canActivate: [AdminGuard]},
      {path: 'company', component: CustomerComponent, canActivate: [AdminGuard]}]
  },
  {path: 'company-list', component: CompanyListComponent},
  {path: 'company-item/:name', component: CompanyItemComponent},
  {path: 'offers', component: OffersComponent, canActivate: [ReserveGuard]},
  {
    path: 'reservation', component: ReservationComponent, canActivate: [CompanyGuard], children:
      [
        {path: 'submit', component: ReservationSubmitComponent, outlet: 'modal', canActivate: [ReserveGuard]}
      ]
  },
  {path: 'profile-company', component: CompanyComponent, canActivate: [AuthCompanyGuard]},
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthClientGuard], children: [
      {path: 'order/:id', component: ReservationHistoryComponent, outlet: 'modal'}
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthClientGuard, AuthCompanyGuard]
})
export class AppRoutingModule {
}
