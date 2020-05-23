import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth.service';
import {
  ExerciseDto, ExerciseServiceProxy, RegimeExerciseDto,
  RegimeExerciseServiceProxy
} from '../../providers/service-proxies/service-proxies';
import {BasePage} from '../../shared/common/basePage';

@IonicPage({
  segment: 'view-exercise/:id'
})
@Component({
  selector: 'page-view-exercise',
  templateUrl: 'view-exercise.html',
})
export class ViewExercisePage extends BasePage{

  model: RegimeExerciseDto = new RegimeExerciseDto();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _regimeExerciseService: RegimeExerciseServiceProxy) {
    super(_authService, navCtrl, _loadingCtrl);
  }

  ionViewDidEnter() {
    let exerciseId = this.navParams.get('id');
    this.loadExercise(exerciseId);
  }

  private loadExercise(id: number): void{
    this._regimeExerciseService.getRegimeExerciseDetails(id)
      .subscribe(res => {
        this.model = res;
      });
  }
}
