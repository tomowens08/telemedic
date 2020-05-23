import {Component} from '@angular/core';
import {AlertController, Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth.service';
import {
  ClinicianServiceProxy, DischargePatientInput, GetPatientDetailsOutput,
  PatientDetailsDto, PatientServiceProxy
} from '../../providers/service-proxies/service-proxies';
import {BasePage} from '../../shared/common/basePage';
import {NgForm} from '@angular/forms';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {EventNames} from '../../shared/events';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {ValidatorType} from '../../providers/validation/validatorType';

@IonicPage({
  segment: 'discharge-patient/:patientId'
})
@Component({
  selector: 'page-discharge-patient',
  templateUrl: 'discharge-patient.html',
})
export class DischargePatientPage extends BasePage {

  patientId: number;
  patient: GetPatientDetailsOutput;
  model: DischargePatientInput;
  validationMessages: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _clinicianService: ClinicianServiceProxy,
              private _loadingCtrl: LoadingController,
              private _formValidationService: FormValidationService,
              private _alertCtrl: AlertController,
              private _patientService: PatientServiceProxy,
              private _events: Events) {
    super(_authService, navCtrl, _loadingCtrl);

    this.prepareValidationMessages();

    this.patient = new GetPatientDetailsOutput();
    this.patient.patientDetails = new PatientDetailsDto();
    this.model = new DischargePatientInput();
  }

  ionViewDidLoad() {
    this.patientId = this.navParams.get('patientId');
    this.model.patientId = this.patientId;
    this.loadPatient();
  }

  discharge(form: NgForm): void {

    if (!this._formValidationService.validateForms([form])) {
      return;
    }

    let confirm = this._alertCtrl.create({
      title: 'Are your sure you want to discharge this patient?',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: () => this.dischargeHandler()
        }
      ]
    });
    confirm.present();
  }

  private dischargeHandler() {
    this.createLoader();
    this._patientService.dischargePatient(this.model)
      .finally(() => this.loader.dismiss())
      .subscribe(() => {
        this._events.publish(EventNames.PatientChanged, true);
        this.navCtrl.pop()
      });
  }

  private loadPatient(): void {

    this.createLoader();

    this._clinicianService.getPatientDetails(this.patientId)
      .finally(() => {
        this.loader.dismiss();
      })
      .subscribe(r => this.patient = r);
  }

  private prepareValidationMessages():void{
    this.validationMessages = {
      dischargeSummary: [
        new ValidationMessage(ValidatorType.required)
      ]
    };
  }
}
