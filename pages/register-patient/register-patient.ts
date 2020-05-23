import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Events, Content, LoadingController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PopoverController} from 'ionic-angular';
import {PopoverMenuComponent} from '../../components/popover-menu/popover-menu';
import {
  RegisterPatientInput,
  ClinicianServiceProxy,
  CountyServiceProxy,
  CountyDto
} from '../../providers/service-proxies/service-proxies';
import {EventNames} from '../../shared/events';
import {ValidatorType} from '../../providers/validation/validatorType';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {NotifyService} from '../../providers/notification/notify.service';
import * as moment from 'moment';
import {AppConsts} from '../../providers/AppConsts';
import {ImageUploadService} from '../../providers/upload/imageUploadService';


@IonicPage()
@Component({
  selector: 'page-register-patient',
  templateUrl: 'register-patient.html',
})
export class RegisterPatientPage extends BasePage {
  model: RegisterPatientInput = new RegisterPatientInput();
  counties: CountyDto[] = [];
  birthday;
  toast;
  validationMessages: any;
  @ViewChild(Content) content: Content;
  displayDateFormat: string = AppConsts.dateTimePickerDisplayFormat;
  profilePic: string;
  canSubmit: boolean = true;

  @ViewChild('file') fileInput: any;

  constructor(private _clinicianService: ClinicianServiceProxy,
              private _countyService: CountyServiceProxy,
              private _formValidationService: FormValidationService,
              private _authService: AuthService,
              private _notifyService: NotifyService,
              public popoverCtrl: PopoverController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public loadingCtrl: LoadingController,
              private _imageUploadService: ImageUploadService) {
    super(_authService, navCtrl, loadingCtrl);
    this.prepareValidationMessages();
    this.getCounties();
  }


  photoSelected(event): void {

   /* if (event.target.files && event.target.files[0]) {

      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.profilePic = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
*/
    this.canSubmit = false;
    this._imageUploadService.upload(event.target.files[0])
      .finally(()=> this.canSubmit = true)
      .subscribe(r => {
        this.model.profileImageTempName = r.fileName;
        this.profilePic = r.uri;
      });
  }

  private getCounties() {
    this._countyService.getCounties().subscribe((result) => {
      this.counties = result.counties;
    });
  }

  private prepareValidationMessages(): void {
    this.validationMessages = {
      firstName: [
        new ValidationMessage(ValidatorType.required)
      ],
      lastName: [
        new ValidationMessage(ValidatorType.required)
      ],
      email: [
        new ValidationMessage(ValidatorType.required)
      ],
      birthDay: [
        new ValidationMessage(ValidatorType.required)
      ],
      houseNumber: [
        new ValidationMessage(ValidatorType.required)
      ],
      address: [
        new ValidationMessage(ValidatorType.required)
      ],
      country: [
        new ValidationMessage(ValidatorType.required)
      ],
      postcode: [
        new ValidationMessage(ValidatorType.required)
      ],
      homeTel: [
        new ValidationMessage(ValidatorType.required)
      ],
      workTel: [
        new ValidationMessage(ValidatorType.required)
      ],
      mobileTel: [
        new ValidationMessage(ValidatorType.required)
      ],
      hospitalNum: [
        new ValidationMessage(ValidatorType.required)
      ],
      practice: [
        new ValidationMessage(ValidatorType.required)
      ],
      comments: [
        new ValidationMessage(ValidatorType.required)
      ]
    };
  }

  deleteProfilePhoto() {
    this.fileInput.nativeElement.value = '';
    this.profilePic = '';
    this.model.profileImageTempName = '';
  }
  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverMenuComponent, {}, {cssClass: 'menu-popover'});
    popover.present({
      ev: myEvent
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPatientPage');
  }

  registerPatient(registerForm: NgForm) {

    if (!this._formValidationService.validateForms([registerForm])) {
      return;
    }

    this.createLoader();

    this._clinicianService.registerPatient(this.model)
      .finally(() => this.loader.dismiss())
      .subscribe((result) => {
        if (!result) {
          this.events.publish(EventNames.PatientRegistered);
          this._notifyService.success('Patient was successfully registered.');
          this.navCtrl.popToRoot();
        }
      });

  }

  handleChangeDate(event) {
    let m = moment(this.birthday);
    this.model.birthDay = moment(m).utc().add(m.utcOffset(), 'm');
  }
}
