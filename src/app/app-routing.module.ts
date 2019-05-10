import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuard} from './auth/auth.guard';
import {SignupClientComponent} from './auth/signup/signup-client/signup-client.component';
import {SignupCompanyComponent} from './auth/signup/signup-company/signup-company.component';
import {ServiceTypesComponent} from './auth/signup/signup-company/service-types/service-types.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  // {path: 'signup', component: SignupComponent},
  {
    path: 'signup', component: SignupComponent, children: [
      {path: 'client', component: SignupClientComponent},
      {path: 'company', component: SignupCompanyComponent}
    ]
  },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
