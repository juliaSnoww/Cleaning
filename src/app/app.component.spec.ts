import {TestBed, async, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CookieModule} from 'ngx-cookie';
import {CookieService} from 'ngx-cookie-service';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AuthService} from './shared/service/auth.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        //  CookieModule.forRoot()
      ],
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      providers: [
        AuthService,
        CookieService,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-header').textContent).toContain('');
  });

  it('should call autoAuthUser on AuthService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'autoAuthUser')
      .and.returnValue(Promise.resolve('Data'));
    fixture.detectChanges();
    expect(app.data).toBe(undefined);
  });

});
