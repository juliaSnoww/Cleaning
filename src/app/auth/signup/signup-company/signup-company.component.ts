import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup-company',
  templateUrl: './signup-company.component.html',
  styleUrls: ['./signup-company.component.scss']
})
export class SignupCompanyComponent implements OnInit, OnDestroy {
  signupFormCompany: FormGroup;
  passMatch = true;
  logoPreview: string | ArrayBuffer;

  constructor() {
  }

  ngOnInit() {
    this.signupFormCompany = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      description: new FormControl(null, Validators.required),
      logo: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      costPerUnit: new FormGroup({
          rooms: new FormGroup({
            bath: new FormControl(null, Validators.required),
            regular: new FormControl(null, Validators.required),
            large: new FormControl(null, Validators.required)
          })
          // types: new FormGroup({
          //   standard: new FormControl(),
          //   general: new FormControl(),
          //   afterConstructions: new FormControl(),
          //   carpetCleaning: new FormControl(),
          //   officeCleaning: new FormControl(),
          //   furnitureCleaning: new FormControl(),
          //   industrialCleaning: new FormControl(),
          //   poolCleaning: new FormControl()
          // })
        }
      ),
      password: new FormControl(null, Validators.required),
      passConfirm: new FormControl(null, Validators.required)
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupFormCompany.get('logo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    let pass;
    let passConfirm;
    pass = this.signupFormCompany.get('password').value;
    passConfirm = this.signupFormCompany.get('passConfirm').value;
    if (pass !== passConfirm) {
      this.passMatch = false;
      return;
    }
    // this.authService.createUser(
    //   this.signupForm.get('username').value,
    //   this.signupForm.get('email').value,
    //   this.signupForm.get('password').value
    // );
  }

  ngOnDestroy() {
    this.signupFormCompany.reset();
  }
}
