import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthenticateModel} from '../../providers/service-proxies/service-proxies';
import {LoginService} from '../../providers/auth/login.service';
import {AuthService} from '../../providers/auth/auth.service';
import {Pages} from '../pages';
import {RoleNames} from '../../shared/roles';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  model: AuthenticateModel = new AuthenticateModel();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _loginService: LoginService,
              private _authService: AuthService) {

    this.checkIsAuthenticated();
  }

  login(): void {
    this._loginService.authenticate(this.model);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  forgotPassword():void{
    this.navCtrl.push(Pages.ForgotPassword);
  }

  private checkIsAuthenticated(): void{
    this._authService.isAuthenticated()
      .then((isAuth) => {
        if(isAuth){
          this._authService.isInRole(RoleNames.Patient).then(inRole=>{
            if(inRole){
              this.navCtrl.setRoot(Pages.PatientDashboard);
            }else{
              this.navCtrl.setRoot(Pages.Dashboard);
            }
          });
        }
      });
  }
}
