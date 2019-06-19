import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.scss']
})
export class ServiceTypesComponent implements OnInit {
  @Output() serviceType = new EventEmitter();
  serviceTypeForm: FormGroup;
  type = [
    {cost: 1, display: 'Standard', value: 'standard'},
    {cost: 2, display: 'General', value: 'general'},
    {cost: 3, display: 'After constructions', value: 'afterConstruction'},
    {cost: 4, display: 'Carpet cleaning', value: 'carpetCleaning'},
    {cost: 5, display: 'Office cleaning', value: 'officeCleaning'},
    {cost: 6, display: 'Furniture cleaning', value: 'furnitureCleaning'},
    {cost: 7, display: 'Industrial cleaning', value: 'industrialCleaning'},
    {cost: 8, display: 'Pool cleaning', value: 'poolCleaning'},
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.serviceTypeForm = this.formBuilder.group({
      type: new FormArray([], minSelectedCheckboxes(1)),
      rooms: this.formBuilder.group({
        bath: new FormControl(null, Validators.required),
        standard: new FormControl(null, Validators.required),
        large: new FormControl(null, Validators.required)
      })
    });

    this.addCheckboxes();
  }

  onSubmit() {
    let type = this.serviceTypeForm.value.type.map((selected, i) => {
      return {
        cost: this.type[i].cost,
        value: this.type[i].value,
        selected
      };
    }).filter(user => user.selected);
    type = transformToObj(type);
    const formValue = Object.assign({}, {
      type,
      rooms: this.serviceTypeForm.value.rooms
    });
    this.serviceType.emit(formValue);

  }

  private addCheckboxes() {
    this.type.map((o, i) => {
      const control = new FormControl(i === 0);
      (this.serviceTypeForm.controls.type as FormArray).push(control);
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
