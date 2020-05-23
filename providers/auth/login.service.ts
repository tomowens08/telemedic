import {Injectable} from '@angular/core';
import {
  TokenAuthServiceProxy,
  AuthenticateModel,
  AuthenticateResultModel
} from '../service-proxies/service-proxies';

import {App, NavController} from 'ionic-angular';
import {Pages} from '../../pages/pages';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {RoleNames} from '../../shared/roles';

@Injectable()
export class LoginService {

  navController: NavController;

  constructor(private _tokenAuthService: TokenAuthServiceProxy,
              private _authService: AuthService,
              public _app: App) {

    this.navController = _app.getRootNav();
  }

  authenticate(model: AuthenticateModel, finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => {});

    this._tokenAuthService
      .authenticate(model)
      .finally(finallyCallback)
      .subscribe(result => this.processAuthenticateResult(result));
  }

  logout(): void {
    this._authService.logout()
      .then(() => {
        this.navController.setRoot(Pages.Login);
      });
  }

  private processAuthenticateResult(authenticateResult: AuthenticateResultModel) {

    if (authenticateResult.shouldResetPassword) {
      console.error('Not support: SHOULD RESET PASSWORD');
    } else if (authenticateResult.requiresTwoFactorVerification) {
      console.error('Not support: TWO FACTOR VERIFICATION');

    } else if (authenticateResult.accessToken) {
      // Successfully logged in
      this._authService.storeToken(authenticateResult.accessToken).then(() => {
        console.log('success auth set token');

        this._authService.isInRole(RoleNames.Patient).then(inRole=>{
          if(inRole){
            this.navController.setRoot(Pages.PatientDashboard);
          }else{
            this.navController.setRoot(Pages.Dashboard);
          }
        });
      });

    } else {
      // Unexpected result!
      console.warn('Unexpected authenticateResult!');
    }
  }


}
