import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {
  ClinicianServiceProxy, GetPatientDetailsOutput,
  PatientDetailsDto
} from '../../providers/service-proxies/service-proxies';
import {Pages} from '../pages';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {EventNames} from '../../shared/events';


@IonicPage({
  segment: 'patient-details/:patientId'
})
@Component({
  selector: 'page-patient-details',
  templateUrl: 'patient-details.html'
})
export class PatientDetailsPage extends BasePage{

  regimeChanged: boolean = false;
  patientId: number;
  model: GetPatientDetailsOutput;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private _clinicianService: ClinicianServiceProxy,
              private _authService: AuthService,
              public loadingCtrl: LoadingController) {

    super(_authService, navCtrl, loadingCtrl);

    this.model = new GetPatientDetailsOutput();
    this.model.patientDetails = new PatientDetailsDto();
  }

  ionViewDidLoad() {
    let patientId: number = this.navParams.get('patientId');
    this.loadPatient(patientId);

    this.patientId = patientId;

    this.events.subscribe(EventNames.PatientChanged,() => this.loadPatient(patientId));
    this.events.subscribe(EventNames.PatientEdit,() => this.loadPatient(patientId));
    this.events.subscribe(EventNames.RegimeCreated2,(res) => {

      this.regimeChanged = res;

    });
    this.events.subscribe(EventNames.DeleteRegime,(res) => {

      this.regimeChanged = res;

    });
  }
  ionViewDidEnter() {
    if(this.regimeChanged) {
      this.loadPatient(this.patientId);
      this.events.publish(EventNames.RegimeCreated2, false);
      this.events.publish(EventNames.DeleteRegime, false);
    }
  }
  ionViewWillUnload() {
    this.events.unsubscribe(EventNames.PatientChanged);
    this.events.unsubscribe(EventNames.PatientEdit);
    this.events.unsubscribe(EventNames.RegimeCreated2);
    this.events.unsubscribe(EventNames.DeleteRegime);
  }

  viewRegimes(){
    this.navCtrl.push(Pages.ViewRegimes, {patientId: this.model.patientDetails.patientId});
  }
  viewFeedback(){
    this.navCtrl.push(Pages.ViewFeedback, {patientId: this.model.patientDetails.patientId});
  }
  editPatient() {
    this.navCtrl.push(Pages.EditPatient, {patientId: this.model.patientDetails.patientId});
  }
  viewProgress(): void{
    this.navCtrl.push(Pages.ViewProgress, {patientId: this.model.patientDetails.patientId});
  }

  private loadPatient(id: number): void {
    this.createLoader();

    this._clinicianService.getPatientDetails(id)
      .finally(()=> {this.loader.dismiss();})
      .subscribe(r => {
      this.model = r;
    });
  }

}
