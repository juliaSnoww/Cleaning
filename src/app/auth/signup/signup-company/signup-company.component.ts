import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';

@Component({
  selector: 'app-signup-company',
  templateUrl: './signup-company.component.html',
  styleUrls: ['./signup-company.component.scss']
})
export class SignupCompanyComponent implements OnInit, OnDestroy {
  signupFormCompany: FormGroup;
  passMatch = true;
  logoPreview: string | ArrayBuffer;
  isFirstPart = true;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.signupFormCompany = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      description: new FormControl(null, Validators.required),
      logo: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      costPerUnit: new FormGroup({}),
      password: new FormControl(null, Validators.required),
      passConfirm: new FormControl(null, Validators.required)
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupFormCompany.patchValue({logo: file});
    this.signupFormCompany.get('logo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  next() {
    this.isFirstPart = !this.isFirstPart;
  }

  sendForm(serviceType) {
    this.signupFormCompany.setControl('costPerUnit', new FormControl(serviceType));
    this.authService.createCompany(this.signupFormCompany.value);
  }

  // onSubmit() {
  //   let pass;
  //   let passConfirm;
  //   pass = this.signupFormCompany.get('password').value;
  //   passConfirm = this.signupFormCompany.get('passConfirm').value;
  //   if (pass !== passConfirm) {
  //     this.passMatch = false;
  //     return;
  //   }
  // }

  ngOnDestroy() {
    this.signupFormCompany.reset();
  }
}
