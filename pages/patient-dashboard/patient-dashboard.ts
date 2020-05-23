import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {
  ClinicianServiceProxy, GetPatientDetailsOutput,
  PatientDetailsDto
} from '../../providers/service-proxies/service-proxies';
import {AuthService} from '../../providers/auth/auth.service';
import {BasePage} from '../../shared/common/basePage';
import {Pages} from '../pages';


@IonicPage()
@Component({
  selector: 'page-patient-dashboard',
  templateUrl: 'patient-dashboard.html',
})
export class PatientDashboardPage extends BasePage {

  model: GetPatientDetailsOutput = new GetPatientDetailsOutput();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _clinicianService: ClinicianServiceProxy) {
    super(_authService, navCtrl, _loadingCtrl);

    this.model.patientDetails = new PatientDetailsDto();
  }

  ionViewDidEnter() {
    this.loadDetails();
  }

  viewFeedbackNav():void{
    this.navCtrl.push(Pages.ViewFeedback, {patientId: -1});
  }

  viewRegimesNav(): void{
    this.navCtrl.push(Pages.PatientRegimes);
  }

  viewProgressNav(): void{
    this.navCtrl.push(Pages.ViewProgress, {patientId: -1})
  }

  private loadDetails(): void {
    this.createLoader();

    this._clinicianService.getCurrentPatientDetails()
      .finally(() => this.loader.dismiss())
      .subscribe(res => {
        this.model = res;
      });
  }

}
