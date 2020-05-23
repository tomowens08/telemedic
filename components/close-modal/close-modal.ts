import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'close-modal',
  templateUrl: 'close-modal.html'
})
export class CloseModalComponent {


  constructor(
      public viewCtrl: ViewController,
  ) {}

  closeModal() {

    this.viewCtrl.dismiss();

  }


}
