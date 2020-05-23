import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import {
  ClinicianGeneralInfoDto,
  LastActivityPatientDto,
  ClinicianServiceProxy
} from '../../providers/service-proxies/service-proxies';
import { EventNames } from '../../shared/events';
import { Pages } from '../pages';
import {BasePage} from '../../shared/common/basePage';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage extends BasePage{
  clinicalInfo: ClinicianGeneralInfoDto = new ClinicianGeneralInfoDto();
  patients: LastActivityPatientDto[] = [];
  birthday: string;
  patientChanged: boolean = false;
  loading;

  constructor(
      private  _authService: AuthService,
      private _clinicianService: ClinicianServiceProxy,
      public loadingCtrl: LoadingController,
      public navCtrl: NavController,
      public events: Events,
      public navParams: NavParams
  ) {
    super(_authService, navCtrl, loadingCtrl);
  }
  ionViewDidLoad() {

    this.getInfo();
    this.getPatients();

    this.events.subscribe(EventNames.PatientRegistered, () => this.getPatients());
    this.events.subscribe(EventNames.EditMyDetails, () => this.getInfo());
    this.events.subscribe(EventNames.PatientEditOnDashboard,(res) => {

      this.patientChanged = res;

    });
    this.events.subscribe(EventNames.PatientChanged,(res) => {

      this.patientChanged = res;

    });
  }
  ionViewDidEnter() {
    if(this.patientChanged) {
      this.getPatients();
      this.events.publish(EventNames.PatientChanged, false);
      this.events.publish(EventNames.PatientEditOnDashboard, false);
    }
  }
  ionViewWillUnload() {
    this.events.unsubscribe(EventNames.PatientRegistered);
    this.events.unsubscribe(EventNames.EditMyDetails);
    this.events.unsubscribe(EventNames.PatientChanged);
  }

  private getInfo() {

    this._clinicianService.getClinicianGeneralInfo().subscribe((res) => {

      this.clinicalInfo = res;

    });

  }
  private getPatients() {

    this._clinicianService.getLastActivityPatients().subscribe((res) => {

      this.patients = res.patients;

    });

  }
  logOut() {

    this._authService.logout()
      .then(()=>{
        this.navCtrl.setRoot(Pages.Login);
    });

  }
  registerRoute() {
    this.navCtrl.push(Pages.RegisterPatient);
  }

  findPatient():void{
    this.navCtrl.push(Pages.FindPatient);
  }

  viewPatient(id: number):void{
    this.navCtrl.push(Pages.PatientDetails, {patientId: id});
  }

  editProfile():void{
    this.navCtrl.push(Pages.EditMyDetails);
  }
}
