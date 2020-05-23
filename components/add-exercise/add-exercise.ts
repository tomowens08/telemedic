import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Events, ViewController, NavParams} from 'ionic-angular';
import {
  EditRegimeExerciseInput,
  AddExerciseToRegimeInput,
  ExerciseDto, RegimeExerciseDto, WarmUpInListDto, WarmUpServiceProxy, RegimeExerciseServiceProxy
} from '../../providers/service-proxies/service-proxies';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {ValidatorType} from '../../providers/validation/validatorType';
import {EventNames} from '../../shared/events';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {NotifyService} from '../../providers/notification/notify.service';

@Component({
  selector: 'add-exercise',
  templateUrl: 'add-exercise.html'
})
export class AddExerciseComponent {
  validationMessages: any;
  regimeId: number;
  isEdit: boolean = false;
  getExercise: any;
  exercise: any;
  regimeExerciseDetails: RegimeExerciseDto;
  warmUps: WarmUpInListDto [] = [];

  constructor(private _formValidationService: FormValidationService,
              public events: Events,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private _notifyService: NotifyService,
              private _warmUpService: WarmUpServiceProxy,
              private _regimeExerciseService: RegimeExerciseServiceProxy) {
    this.exercise = new AddExerciseToRegimeInput();
    this.regimeExerciseDetails = new RegimeExerciseDto();

    this.regimeId = navParams.get('regimeId');
    this.isEdit = navParams.get('isEdit');

    this.loadWarmUps();

    if (this.isEdit) {

      this.exercise = new EditRegimeExerciseInput();
      this.getExercise = new RegimeExerciseDto();
      this.getExercise = navParams.get('exercise');
      this.loadRegimeExerciseDetails(this.getExercise.id);

    } else {

      this.exercise = new AddExerciseToRegimeInput();
      this.getExercise = new RegimeExerciseDto();
      this.getExercise = navParams.get('exercise');
      this.initExerciseForAdd();

    }

    this.prepareValidationMessages();

  }

  saveExercise(form: NgForm) {
    if (!this._formValidationService.validateForms([form])) {
      return;
    }


    if (!this.exercise.isSuitableForRepetition) {
      this.exercise.repetition = null;
    }

    if (!this.exercise.isSuitableForTimeBasedRoutine) {
      this.exercise.quantityOfMinutes = null;
    }

    if (!this.isEdit) {
      this._regimeExerciseService.addExerciseToRegime(this.exercise).subscribe(result => {
        this._notifyService.success(`The exercise added to the regime`);
        this.events.publish(EventNames.RegimeAddExercise1, this.regimeId);
        this.viewCtrl.dismiss();
      });
    } else {
      this._regimeExerciseService.editRegimeExercise(this.exercise).subscribe(result => {
        this.events.publish(EventNames.RegimeChanged);
        this.viewCtrl.dismiss();
      });
    }
  }

  suitableForRepetitionChanged(): void {
    if (this.exercise.isSuitableForRepetition) {
      this.exercise.isSuitableForTimeBasedRoutine = false;
      this.exercise.quantityOfMinutes = null;
    }
  }

  suitableForTimeBasedRoutineChanged(): void {
    if (this.exercise.isSuitableForTimeBasedRoutine) {
      this.exercise.isSuitableForRepetition = false;
      this.exercise.repetition = null;
    }
  }


  private initExerciseForEdit() {

    this.exercise.init({
      regimeExerciseId: this.getExercise.id,
      isLeft: this.regimeExerciseDetails.isLeft,
      isRight: this.regimeExerciseDetails.isRight,
      isSuitableForRepetition: this.regimeExerciseDetails.isSuitableForRepetition,
      repetition: this.regimeExerciseDetails.repetition,
      isSuitableForTimeBasedRoutine: this.regimeExerciseDetails.isSuitableForTimeBasedRoutine,
      quantityOfMinutes: this.regimeExerciseDetails.quantityOfMinutes,
      warmUpIds: this.regimeExerciseDetails.exerciseWarmUps.map(ew => ew.warmUpId)
    });
  }

  private initExerciseForAdd() {

    this.exercise.init({
      regimeId: this.regimeId,
      exerciseId: this.getExercise.id,
      isLeft: this.getExercise.isLeft,
      isRight: this.getExercise.isRight,
      isSuitableForRepetition: this.getExercise.isSuitableForRepetition,
      repetition: this.getExercise.repetition,
      isSuitableForTimeBasedRoutine: this.getExercise.isSuitableForTimeBasedRoutine,
      quantityOfMinutes: this.getExercise.quantityOfMinutes
    });

  }

  private loadRegimeExerciseDetails(regimeExerciseId: number) {
    this._regimeExerciseService.getRegimeExerciseDetails(regimeExerciseId).subscribe(result => {
      this.regimeExerciseDetails = result;
      this.initExerciseForEdit();
    });
  }

  private prepareValidationMessages(): void {
    this.validationMessages = {
      quantityOfMinutes: [
        new ValidationMessage(ValidatorType.required),
        new ValidationMessage(ValidatorType.min, 'Minimum 0')
      ],
      repetition: [
        new ValidationMessage(ValidatorType.required),
        new ValidationMessage(ValidatorType.min, 'Minimum 0')
      ]
    };
  }

  private loadWarmUps(): void {
    this._warmUpService.getWarmUpList().subscribe(res => {
      this.warmUps = res.warmUps;
    });
  }
}
