import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appMin]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinDirective, multi: true },
  ],
})
export class MinDirective implements Validator {
  @Input('appMin') min: string | number = -88888;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const value = +control.value;
    if (value <= +this.min) {
      return { bid: { value } };
    }
    return null;
  }
}
