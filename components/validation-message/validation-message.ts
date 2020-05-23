import {Component, Input} from '@angular/core';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'val-message',
  templateUrl: 'validation-message.html'
})
export class ValidationMessageComponent {

  @Input() control: FormControl;
  @Input() messages: ValidationMessage[];

  constructor() {
  }

}
