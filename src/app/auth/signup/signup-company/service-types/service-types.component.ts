import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.scss']
})
export class ServiceTypesComponent implements OnInit {
  serviceTypeForm: FormGroup;
  type = [
    {cost: 1, name: 'Standard'},
    {cost: 2, name: 'General'},
    {cost: 3, name: 'After constructions'},
    {cost: 4, name: 'Carpet cleaning'},
    {cost: 5, name: 'Office cleaning'},
    {cost: 6, name: 'Furniture cleaning'},
    {cost: 7, name: 'Industrial cleaning'},
    {cost: 8, name: 'Pool cleaning'},
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.serviceTypeForm = this.formBuilder.group({
      type: new FormArray([], minSelectedCheckboxes(1))
    });

    this.addCheckboxes();
    console.log(this.serviceTypeForm.controls.type.controls);
  }

  private addCheckboxes() {
    this.type.map((o, i) => {
      const control = new FormControl(i === 0);
      (this.serviceTypeForm.controls.type as FormArray).push(control);
    });
  }

  onSubmit() {
    const formValue = Object.assign({}, {
      type: this.serviceTypeForm.value.type.map((selected, i) => {
        return {
          name: this.type[i].name,
          cost: this.type[i].cost,
          selected
        };
      }).filter(user => user.selected)
    });
    console.log(formValue);
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
