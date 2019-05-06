import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SignupClientComponent } from './auth/signup/signup-client/signup-client.component';
import { SignupCompanyComponent } from './auth/signup/signup-company/signup-company.component';
import { ServiceTypesComponent } from './auth/signup/signup-company/service-types/service-types.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    ProfileComponent,
    SignupClientComponent,
    SignupCompanyComponent,
    ServiceTypesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor ,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
