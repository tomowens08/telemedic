import {Component, Input} from '@angular/core';
import {PopoverMenuComponent} from '../popover-menu/popover-menu';
import {PopoverController} from 'ionic-angular';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Input() title: string;

  constructor(public popoverCtrl: PopoverController) {
  }

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverMenuComponent, {}, {cssClass: 'menu-popover'});
    popover.present({
      ev: myEvent
    });
  }

}
