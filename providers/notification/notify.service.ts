import {Injectable} from '@angular/core';
import {Toast, ToastController} from 'ionic-angular';

@Injectable()
export class NotifyService{
  constructor(private _toastCtrl: ToastController){
  }

  success(message: string, position: string = 'top', duration: number = 3000): Toast{
    return  this.createBaseToast(message, 'success', position, duration);
  }

  warning(message: string, position: string = 'top', duration: number = 3000): Toast{
    return  this.createBaseToast(message, 'warning', position, duration);
  }

  error(message: string, position: string = 'top', duration: number = 3000): Toast{
    return  this.createBaseToast(message, 'error', position, duration);
  }

  private createBaseToast(message: string, cssClass: string, position: string, duration: number): Toast{
    let toastr = this._toastCtrl.create({
      message: message,
      position: position,
      duration: duration,
      cssClass: cssClass
    });

    toastr.present();
    return toastr;
  }

}
