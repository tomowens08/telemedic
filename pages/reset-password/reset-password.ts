import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ResetPassword} from '../../models/resetPassword';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {NotifyService} from '../../providers/notification/notify.service';
import {AccountServiceProxy, AuthenticateModel} from '../../providers/service-proxies/service-proxies';
import {NgForm} from '@angular/forms';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {Pages} from '../pages';
import {LoginService} from '../../providers/auth/login.service';
import {TenantService} from '../../providers/auth/tenant.service';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {ValidatorType} from '../../providers/validation/validatorType';


@IonicPage({
  segment: 'reset-password/:userId/:code/:tenantId'
})
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage extends BasePage {

  model: ResetPassword = new ResetPassword();
  validationMessages: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _notifyService: NotifyService,
              private _accountService: AccountServiceProxy,
              private _formValidationService: FormValidationService,
              private _loginService: LoginService,
              private _tenantService: TenantService) {
    super(_authService, navCtrl, _loadingCtrl);

    this.prepareValidationMessages();
  }

  ionViewDidLoad() {
    this.model.userId = this.navParams.get('userId');
    this.model.resetCode = this.navParams.get('code');

    let tenantId = this.navParams.get('tenantId');
    this.setTenant(tenantId);
  }

  ionViewCanEnter() {
    return super.ionViewCanEnterAnonim();
  }


  reset(form: NgForm): void {
    if (!this._formValidationService.validateForms([form])) {
      return;
    }

    this.createLoader();

    this._accountService.resetPassword(this.model)
      .finally(() => this.loader.dismiss())
      .subscribe(res => {
        if (!res.canLogin) {
          this._notifyService.success('Your password was changed');
          this.navCtrl.setRoot(Pages.Login);
          return;
        }

        let authModel= new AuthenticateModel();
        authModel.userNameOrEmailAddress = res.userName;
        authModel.password = this.model.password;

        this._loginService.authenticate(authModel);
      });
  }

  private setTenant(tenantId: number): void{
    this._tenantService.set(tenantId);
  }

  private prepareValidationMessages(){
    this.validationMessages = {
      password: [
        new ValidationMessage(ValidatorType.required)
      ],
      passwordRepeat: [
        new ValidationMessage(ValidatorType.equalTo)
      ]
    };
  }
}
