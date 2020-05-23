import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AccountServiceProxy, SendPasswordResetCodeInput} from '../../providers/service-proxies/service-proxies';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {NgForm} from '@angular/forms';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {NotifyService} from '../../providers/notification/notify.service';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {ValidatorType} from '../../providers/validation/validatorType';
import {Pages} from '../pages';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage extends BasePage {

  model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();
  validationMessages: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _formValidationService: FormValidationService,
              private _accountService: AccountServiceProxy,
              private _notifyService: NotifyService) {

    super(_authService, navCtrl, _loadingCtrl);
    this.prepareValidationMessages();
  }

  ionViewCanEnter() {
    //overrides method in base class
    return this.ionViewCanEnterAnonim();
  }

  send(form: NgForm) {
    if (!this._formValidationService.validateForms([form])) {
      return;
    }

    this.createLoader();
    this._accountService.sendPasswordResetCode(this.model)
      .finally(() => this.loader.dismiss())
      .subscribe(() => {
        this._notifyService.success('A password reset link sent to your e-mail address. Please check your emails.');
        this.navCtrl.setRoot(Pages.Login);
      });
  }

  private prepareValidationMessages(): void{
    this.validationMessages = {
      email: [
        new ValidationMessage(ValidatorType.required),
        new ValidationMessage(ValidatorType.email, 'Invalid email')
      ]
    };
  }
}
