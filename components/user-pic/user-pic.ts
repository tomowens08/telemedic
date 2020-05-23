import {Component, Input} from '@angular/core';
@Component({
  selector: 'user-pic',
  templateUrl: 'user-pic.html'
})
export class UserPicComponent{

  @Input() img: string;

  constructor() {
  }

  getPic(): string{
    if(!this.img){
      this.img = 'assets/imgs/avatar.jpg';
    }
    return this.img;
  }

}
