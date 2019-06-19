import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {AuthService} from '../../shared/service/auth.service';
import {Company} from '../../shared/model/company.model';
import {CompanyService} from '../../shared/service/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  company;
  isChangePsw = false;
  isShowComments = false;
  profileForm: FormGroup;
  passMatch = true;
  msgError: string;
  private userInfoSubscription;
  commentsArray;
  imageUrl;
  type = [
    {cost: 0, display: 'Standard', value: 'standard'},
    {cost: 0, display: 'General', value: 'general'},
    {cost: 0, display: 'After constructions', value: 'afterConstruction'},
    {cost: 0, display: 'Carpet cleaning', value: 'carpetCleaning'},
    {cost: 0, display: 'Office cleaning', value: 'officeCleaning'},
    {cost: 0, display: 'Furniture cleaning', value: 'furnitureCleaning'},
    {cost: 0, display: 'Industrial cleaning', value: 'industrialCleaning'},
    {cost: 0, display: 'Pool cleaning', value: 'poolCleaning'},
  ];

  constructor(private http: HttpClient,
              private companyService: CompanyService,
              private authService: AuthService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.userInfoSubscription = this.authService.getCompanyInfo().subscribe(
      (response: Company) => {
        console.log(response);
        this.company = response.company;
        this.imageUrl = this.company.logo || null;
        const name = response.name;
        const rooms = this.company.costPerUnit.rooms;
        this.profileForm = this.fb.group({
          info: new FormGroup({
            logo: new FormControl(this.imageUrl),
            type: new FormArray([], minSelectedCheckboxes(1)),
            name: new FormControl(name, Validators.required),
            rate: new FormControl(this.company.rate),
            address: new FormControl(this.company.address, Validators.required),
            description: new FormControl(this.company.description, Validators.required),
            rooms: new FormGroup({
              bath: new FormControl(rooms.bath, Validators.required),
              standard: new FormControl(rooms.standard || rooms.standardRoom, Validators.required),
              large: new FormControl(rooms.large || rooms.largeRoom, Validators.required),
            })
          }),
          pass: this.fb.group({
            oldPass: new FormControl(null, Validators.required),
            newPass: new FormControl(null, Validators.required),
            confirmPass: new FormControl(null, Validators.required)
          })
        });
        const type = response.company.costPerUnit.type;
        this.addCheckboxes(type);
        this.type.forEach(el => {
          if (el.value in type) el.cost = type[el.value];
        });
        this.companyService.getComments('company')
          .subscribe(comments => this.commentsArray = comments);
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.profileForm.get('info').patchValue({logo: file});
    this.profileForm.get('info').get('logo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  changePsw() {
    this.isChangePsw = !this.isChangePsw;
    if (!this.isChangePsw) this.profileForm.controls.pass.reset();
  }

  savePsw() {
    if (this.profileForm.controls.pass.pristine) {
      this.isChangePsw = !this.isChangePsw;
    }
    if (this.profileForm.controls.pass.valid) {
      const oldPsw = this.profileForm.get('pass.oldPass').value;
      const psw = this.profileForm.get('pass.newPass').value;
      const pswConfirm = this.profileForm.get('pass.confirmPass').value;
      if (psw !== pswConfirm) {
        this.passMatch = false;
      } else {
        this.authService.updatePsw(oldPsw, psw).subscribe((response: { msg: string }) => {
          this.msgError = response.msg;
          if (this.msgError === 'ok') {
            this.isChangePsw = !this.isChangePsw;
            this.profileForm.controls.pass.reset();
            this.msgError = '';
          }
        });
      }
    }
  }

  onSubmit() {
    if (this.profileForm.controls.info.valid) {
      let type = this.profileForm.value.info.type.map((selected, i) => {
        return {
          cost: this.type[i].cost,
          value: this.type[i].value,
          selected
        };
      }).filter(user => user.selected);
      type = transformToObj(type);
      const obj = this.profileForm.value.info;
      obj.type = type;
      this.authService.updateCompanyInfo(obj);
    }
  }

  showAllComments() {
    this.isShowComments = !this.isShowComments;
  }

  private addCheckboxes(type) {
    this.type.map((el) => {
      const control = new FormControl(el.value in type);
      (this.profileForm.get('info').get('type') as FormArray).push(control);
    });
  }

}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);
    return totalSelected >= min ? null : {required: true};
  };
  return validator;
}

function transformToObj(array) {
  let obj = {};
  array.forEach((el) => {
    obj[el.value] = +el.cost;
  });
  return obj;
}
