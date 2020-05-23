import {Component, Input} from '@angular/core';
import {PatientDetailsDto} from '../../providers/service-proxies/service-proxies';
import {NavController} from 'ionic-angular';
import {Pages} from '../../pages/pages';

@Component({
  selector: 'patient-info',
  templateUrl: 'patient-info.html'
})
export class PatientInfoComponent {

  @Input() model: PatientDetailsDto;
  @Input() isShowButtons: boolean;

  dischargedStatus: number  = 3;

  constructor(public navCtrl: NavController) {
    this.model = new PatientDetailsDto();
  }

  discharge():void{
    this.navCtrl.push(Pages.DischargePatient, {patientId: this.model.patientId});
  }

  editPatient(): void{
    this.navCtrl.push(Pages.EditPatient, {patientId: this.model.patientId});
  }
}
