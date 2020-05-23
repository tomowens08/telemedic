import {Component} from '@angular/core';
import {AlertController, Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppConsts} from '../../providers/AppConsts';
import {EventNames} from '../../shared/events';
import * as moment from 'moment';
import {NgForm} from '@angular/forms';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {ValidatorType} from '../../providers/validation/validatorType';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {
  RegimeInListDto,
  CreateNewPatientRegimeInput,
  RegimeServiceProxy
} from '../../providers/service-proxies/service-proxies';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {NotifyService} from '../../providers/notification/notify.service';

@IonicPage({
  segment: 'create-regime/:patientId/:regimeId'
})
@Component({
  selector: 'page-create-regime',
  templateUrl: 'create-regime.html',
})
export class CreateRegimePage extends BasePage {
  patientId: number;
  regimeId: number;
  modify: boolean = false;
  datepickerDisplayFormat: string = AppConsts.dateTimePickerDisplayFormat;
  startDate: string;
  endDate: string;
  minEndDate: string;
  validationMessages: any;
  model: any;
  frequencyInterval: number;
  modelModify: CreateNewPatientRegimeInput = new CreateNewPatientRegimeInput();
  dateTimePickerMaxYear: number = AppConsts.dateTimePickerMaxYear;

  constructor(private _formValidationService: FormValidationService,
              private _regimeService: RegimeServiceProxy,
              private _authService: AuthService,
              private _notifyService: NotifyService,
              public loadingCtrl: LoadingController,
              public events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _alertCtrl: AlertController) {

    super(_authService, navCtrl, loadingCtrl);

    this.prepareValidationMessages();
    this.model = new CreateNewPatientRegimeInput();
  }

  ionViewDidLoad() {

    this.patientId = this.navParams.get('patientId');
    this.regimeId = this.navParams.get('regimeId');

    if (this.regimeId != -1) {
      this.modify = true;
      this.model = new RegimeInListDto();
      this.loadRegime(this.regimeId);
    } else {
      this.model = new CreateNewPatientRegimeInput();
      this.model.patientId = this.patientId;
    }


  }

  startDateSelected(): void {
    this.model.startDate = moment(this.startDate);
    this.setMinEndDate();
  }
  endDateSelected(): void {
    this.model.endDate = moment(this.endDate);
  }
  save(form: NgForm) {
    if (!this._formValidationService.validateForms([form])) {
      return;
    }

    if (this.modify) {
      this.frequencyInterval = this.model.frequencyInterval;
      this.modelModify.id = this.model.id;
      this.modelModify.patientId = this.model.patientId;
      this.modelModify.title = this.model.title;
      this.modelModify.startDate = this.model.startDate;
      this.modelModify.endDate = this.model.endDate;
      this.modelModify.frequency = this.model.frequency;
      this.modelModify.frequencyInterval = this.frequencyInterval;
    }

    this.createLoader();

    this._regimeService.checkIfRegimeExists(this.model)
      .subscribe(res => {
        this.loader.dismiss();
        if (res.isExists) {
          let alert = this._alertCtrl.create({
            title: `You already have regime with the same settings - ${res.title}.`,
            message: 'Are you sure you want to create a new one?',
            buttons: [
              {
                text: 'No',
                role: 'cancel'
              },
              {
                text: 'Yes',
                handler: () => {
                  this.createRegime();
                }
              }
            ]
          });

          alert.present();

        } else {
          this.createRegime();
        }
      }, ()=> this.loader.dismiss())
  }

  private setMinEndDate() {

    if(this.endDate && !(moment(this.endDate).isAfter(this.startDate, 'day'))) {
      this.endDate = null;
    }

    this.minEndDate = this.startDate;
  }
  private createRegime() {
    this.createLoader();
    this._regimeService.createNewPatientRegime(this.model)
      .finally(() => {
        this.loader.dismiss();
      })
      .subscribe(r => {
        this.events.publish(EventNames.RegimeCreated1, true);
        this.events.publish(EventNames.RegimeCreated2, true);
        if (this.modify) {
          this._notifyService.success('Regime was successfully updated!');
        } else {
          this._notifyService.success('Regime was successfully created!');
        }

        this.navCtrl.pop()
      });
  }
  private loadRegime(id: number): void {
    this.createLoader();
    this._regimeService.getRegime(id).subscribe(result => {
      this.loader.dismiss();
      this.model = result;
      this.startDate = moment(this.model.startDate).format('YYYY-MM-DD');
      this.endDate = moment(this.model.endDate).format('YYYY-MM-DD');
    });
  }
  private prepareValidationMessages(): void {
    this.validationMessages = {
      title: [
        new ValidationMessage(ValidatorType.required)
      ],
      startDate: [
        new ValidationMessage(ValidatorType.required)
      ],
      endDate: [
        new ValidationMessage(ValidatorType.required)
      ],
      frequency: [
        new ValidationMessage(ValidatorType.required),
        new ValidationMessage(ValidatorType.min, 'Minimum 0')
      ],
      frequencyInterval: [
        new ValidationMessage(ValidatorType.required)
      ]
    };
  }
}
