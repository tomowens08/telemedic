import {Component} from '@angular/core';
import {App, NavController, ViewController} from 'ionic-angular';
import {Pages} from '../../pages/pages';
import {AuthService} from '../../providers/auth/auth.service';
import {RoleNames} from '../../shared/roles';


@Component({
  selector: 'popover-menu',
  templateUrl: 'popover-menu.html'
})
export class PopoverMenuComponent {

  navCtrl: NavController;

  isPatient: boolean = true;

  constructor(public viewCtrl: ViewController,
              private _authService: AuthService,
              private _app: App) {

    this.navCtrl = this._app.getRootNav();

    this.checkIsPatient();
  }


  home(): void {
    this.hidePopover()
      .then(() => {
        if (this.isPatient) {
          this.navCtrl.setRoot(Pages.PatientDashboard)
        } else {
          this.navCtrl.setRoot(Pages.Dashboard)
        }
      });
  }

  profile(): void {
    this.hidePopover()
      .then(() => this.navCtrl.push(Pages.EditMyDetails));
  }

  logout(): void {
    this.hidePopover()
      .then(() => this._authService.logout()
        .then(() => this.navCtrl.setRoot(Pages.Login)));
  }

  private checkIsPatient(): void {
    this._authService.isInRole(RoleNames.Patient).then(res => {
      this.isPatient = res;
    });
  }

  private hidePopover(): Promise<any> {
    return this.viewCtrl.dismiss();
  }
}
