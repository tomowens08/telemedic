import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth.service';
import {BasePage} from '../../shared/common/basePage';
import {RegimeInListDto, RegimeServiceProxy} from '../../providers/service-proxies/service-proxies';
import {Pages} from '../pages';

@IonicPage()
@Component({
  selector: 'page-patient-regimes',
  templateUrl: 'patient-regimes.html',
})
export class PatientRegimesPage extends BasePage {

  regimes: RegimeInListDto [] = [];
  activeRegimeId: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _regimeService: RegimeServiceProxy) {
    super(_authService, navCtrl, _loadingCtrl);
  }

  ionViewDidEnter() {
    this.loadRegimes();
  }

  viewExerciseNav(id: number){
    this.navCtrl.push(Pages.ViewExercise, {id: id});
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

  private loadRegimes(): void {
    this.createLoader();
    this._regimeService.getMyRegimes()
      .finally(() => this.loader.dismiss())
      .subscribe(res => {
        this.regimes = res.regimes;
      })
  }
}
