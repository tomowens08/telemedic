import { Component } from '@angular/core';

/**
 * Generated class for the ExpandableComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent {

  text: string;

  constructor() {
    console.log('Hello ExpandableComponent Component');
    this.text = 'Hello World';
  }

}
