import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {
  ExercisePerformanceServiceProxy, ExerciseProgressSummaryInListDto,
  GetPatientCommonProgressOutput, RegimeInSimpleListDto, RegimeServiceProxy
} from '../../providers/service-proxies/service-proxies';

import {orderBy} from 'lodash';
import {Pages} from '../pages';

@IonicPage({
  segment: 'view-progress/:patientId'
})
@Component({
  selector: 'page-view-progress',
  templateUrl: 'view-progress.html',
})
export class ViewProgressPage extends BasePage {

  patientId: number;
  commonProgress: GetPatientCommonProgressOutput = new GetPatientCommonProgressOutput();
  regimes: RegimeInSimpleListDto[] = [];
  exercisesPerformance: ExerciseProgressSummaryInListDto[] = [];
  activeRegimeId: number;
  exerciseOrder: string = 'asc';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _exercisePerformanceService: ExercisePerformanceServiceProxy,
              private _regimeService: RegimeServiceProxy) {
    super(_authService, navCtrl, _loadingCtrl);
  }

  ionViewDidEnter() {
    this.patientId = this.navParams.get('patientId');

    if(this.patientId == -1){
      this.patientId = undefined;
    }

    this.loadCommonProgress();
    this.loadRegimes();
  }

  regimeChanged(): void {
    this.loadRegimeProgress(this.activeRegimeId);
  }

  changedOrder(): void {
    this.exercisesPerformance = orderBy(this.exercisesPerformance, ['avgScore'], [this.exerciseOrder]);
  }

  reviewExerciseNav(regimeExerciseId: number): void {
    this.navCtrl.push(Pages.ReviewExercise, {id: regimeExerciseId});
  }

  private loadCommonProgress(): void {
    this.createLoader();

    this._exercisePerformanceService.getPatientCommonProgress(this.patientId)
      .finally(() => this.loader.dismiss())
      .subscribe(res => {
        this.commonProgress = res;
      });
  }

  private loadRegimes(): void {
    console.log('rp', this.patientId);
    this._regimeService.getAllPatientRegimesSimpleList(this.patientId).subscribe(res => {
      this.regimes = res.regimes;

      if (this.regimes.length > 0) {
        let regimeId = this.regimes[0].id;
        this.activeRegimeId = regimeId;
        this.loadRegimeProgress(regimeId);
      }
    });
  }

  private loadRegimeProgress(regimeId: number): void {
    this._exercisePerformanceService.getRegimeProgress(regimeId)
      .subscribe(res => {
        this.exercisesPerformance = res.progresses;
        this.changedOrder();
      });
  }
}
