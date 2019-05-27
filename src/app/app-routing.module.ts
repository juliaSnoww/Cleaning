import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './shared/guard/auth.guard';

import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {ProfileComponent} from './profile/profile.component';
import {SignupClientComponent} from './auth/signup/signup-client/signup-client.component';
import {SignupCompanyComponent} from './auth/signup/signup-company/signup-company.component';
import {ReservationComponent} from './reservation/reservation.component';
import {CompanyListComponent} from './company-list/company-list.component';
import {ReservationSubmitComponent} from './reservation/reservation-submit/reservation-submit.component';
import {ReserveGuard} from './shared/guard/reserve.guard';
import {CompanyGuard} from './shared/guard/company.guard';

const routes: Routes = [
  {path: '', component: ReservationComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'signup', component: SignupComponent, children: [
      {path: 'client', component: SignupClientComponent},
      {path: 'company', component: SignupCompanyComponent}
    ]
  },
  {path: 'company-list', component: CompanyListComponent},
  {path: 'reservation', component: ReservationComponent, canActivate: [CompanyGuard], children:[
      {path: 'submit', component: ReservationSubmitComponent, outlet: 'submit', canActivate: [ReserveGuard]}
    ]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  // {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
