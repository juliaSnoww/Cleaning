import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[OnlyInteger]'
})
export class OnlyIntegerDirective {

  constructor(private el: ElementRef) {
  }

  @Input() OnlyInteger: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = event as KeyboardEvent;
    if (this.OnlyInteger) {
      if ([46, 8, 27, 13, 37, 39].indexOf(e.keyCode) !== -1) {
        return;
      }
      if (
        (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57))
        && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }

}
