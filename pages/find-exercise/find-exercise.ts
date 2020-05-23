import { Component } from '@angular/core';
import { Events, LoadingController, ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  BodyPartServiceProxy,
  BodyPartDto,
  ExerciseDto,
  ExerciseServiceProxy,
  FindExercisesInput

} from '../../providers/service-proxies/service-proxies';
import { EventNames } from '../../shared/events';
import { BasePage } from '../../shared/common/basePage';
import { AuthService } from '../../providers/auth/auth.service';
import { AddExerciseComponent } from '../../components/add-exercise/add-exercise';

@IonicPage({
  segment: 'find-exercise/:regimeId'
})
@Component({
  selector: 'page-find-exercise',
  templateUrl: 'find-exercise.html',
})
export class FindExercisePage extends BasePage {

  regimeId: number;
  filter: FindExercisesInput;
  exercises: ExerciseDto[] = [];
  bodyParts: BodyPartDto[] = [];
  searchType: string = 'name';

  constructor(
      private _exerciseService: ExerciseServiceProxy,
      private _bodyPartService: BodyPartServiceProxy,
      private _authService: AuthService,
      public loadingCtrl: LoadingController,
      public events: Events,
      public modalCtrl: ModalController,
      public navCtrl: NavController,
      public navParams: NavParams
  ) {
    super(_authService, navCtrl, loadingCtrl);

    this.filter = new FindExercisesInput();

  }

  ionViewDidLoad() {

    this.regimeId = this.navParams.get('regimeId');

    this.getBodyParts();
    this.search();

    this.events.subscribe(EventNames.RegimeAddExercise1, (res) => {

      if(res) {
        this.navCtrl.pop();
      }

    });

  }
  ionViewDidLeave() {

    this.events.publish(EventNames.RegimeChanged);
    this.events.publish(EventNames.RegimeAddExercise2, this.regimeId);
    this.events.unsubscribe(EventNames.RegimeAddExercise1);

  }
  private getBodyParts() {

    this._bodyPartService.getBodyParts().subscribe(result => {

      this.bodyParts = result.bodyParts;

    });

  }
  clearFilter(): void {
    this.filter.name = null;
    this.filter.bodyPartId = null;

    this.search();
  }
  openModal(exercise: ExerciseDto) {

    let modal = this.modalCtrl.create(AddExerciseComponent, {
      regimeId: this.regimeId,
      exercise: exercise
    });
    modal.present();

  }
  search() {

    this.createLoader();

    this._exerciseService.findExercises(this.filter).subscribe(result => {
      this.loader.dismiss();
      this.exercises = result.exercises;

    });

  }

}
