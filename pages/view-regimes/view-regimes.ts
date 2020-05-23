import { Component } from '@angular/core';
import { AlertController, ModalController, Events, LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  ExerciseDto,
  ExerciseServiceProxy,
  RegimeServiceProxy,
  RegimeInListDto,
  GetAllPatientRegimesOutput, RegimeExerciseServiceProxy
} from '../../providers/service-proxies/service-proxies';
import {Pages} from '../pages';
import {EventNames} from '../../shared/events';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import { AddExerciseComponent } from '../../components/add-exercise/add-exercise';

@IonicPage({
  segment: 'view-regimes/:patientId'
})
@Component({
  selector: 'page-view-regimes',
  templateUrl: 'view-regimes.html',
})
export class ViewRegimesPage extends BasePage {
  loading;
  editExerciseNumber: string;
  patientId: number;
  regimes: GetAllPatientRegimesOutput = new GetAllPatientRegimesOutput();
  regimesList: RegimeInListDto[] = [];
  activeRegimeId: number = 0;
  isPatientDischarged: boolean;

  constructor(
      private _regimeService: RegimeServiceProxy,
      private _authService: AuthService,
      public navCtrl: NavController,
      public loadingCtrl: LoadingController,
      public events: Events,
      public navParams: NavParams,
      public modalCtrl: ModalController,
      private alertCtrl: AlertController,
      private _regimeExerciseService: RegimeExerciseServiceProxy
  ) {
    super(_authService, navCtrl, loadingCtrl);
  }

  ionViewDidLoad() {
    this.patientId = this.navParams.get('patientId');
    this.loadRegimes(this.patientId);

    this.events.subscribe(EventNames.RegimeCreated1, (res) => {

      if(res) {
        this.loadRegimes(this.patientId)
      }

    });
    this.events.subscribe(EventNames.RegimeAddExercise2, (res) => {

      if(res) {
        this.activeRegimeId = res;
      }


    });
    this.events.subscribe(EventNames.RegimeChanged, () => this.loadRegimes(this.patientId));

  }

  ionViewWillUnload() {
    this.events.unsubscribe(EventNames.RegimeCreated1);
    this.events.unsubscribe(EventNames.RegimeChanged);
    this.events.unsubscribe(EventNames.RegimeAddExercise2);
  }

  private loadRegimes(id: number): void {
    this.createLoader();

    this._regimeService.getAllPatientRegimes(id).subscribe(result => {
      this.loader.dismiss();
      this.regimes = result;
      this.regimesList = this.regimes.regimes;
      this.isPatientDischarged = result.isPatientDischarged;
    });
  }

  createRegime():void{
    this.navCtrl.push(Pages.CreateRegime, {'patientId': this.patientId, 'regimeId': -1});
  }
  deleteRegime(regimeId: number): void {

    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want delete this regime?',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: () => this.deleteRegimeHandler(regimeId)
        }
      ]
    });
    confirm.present();

  }
  deleteExerciseFromRegime(regimeExerciseId: number) {

    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want delete this exercise from regime?',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: () => this.deleteExerciseHandler(regimeExerciseId)
        }
      ]
    });
    confirm.present();

  }
  deleteExerciseHandler(regimeExerciseId: number) {
    this._regimeExerciseService.removeExerciseFromRegime(regimeExerciseId).subscribe(result => {
      this.loadRegimes(this.patientId);
    });
  }
  deleteRegimeHandler(regimeId: number) {
    this._regimeService.deleteRegime(regimeId).subscribe(result => {
      this.loadRegimes(this.patientId);
      this.events.publish(EventNames.DeleteRegime, true);
    });
  }

  modifyRegime(regimeId: number): void {
    this.navCtrl.push(Pages.ModifyRegime, {'patientId': this.patientId, 'regimeId': regimeId});
  }

  addExercise(regimeId: number): void {
    this.navCtrl.push(Pages.FindExercise, {'regimeId': regimeId});
  }

  editExercise(regimeId: number, exercise: ExerciseDto) {
    let modal = this.modalCtrl.create(AddExerciseComponent, {
      regimeId: regimeId,
      exercise: exercise,
      isEdit: true
    });
    modal.present();
  }

  toggleExercises(regimeId: number): void{
    if(this.activeRegimeId == regimeId){
      this.activeRegimeId = 0;
    }else{
      this.activeRegimeId = regimeId;
    }
  }

  isShowExerciseList(regimeId: number){
    return this.activeRegimeId == regimeId;
  }

}
