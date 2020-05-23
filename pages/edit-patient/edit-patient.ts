import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Events, Content, LoadingController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {
  ClinicianServiceProxy,
  EditPatientDetailsInput,
  GetPatientDetailsOutput,
  CountyServiceProxy,
  CountyDto
} from '../../providers/service-proxies/service-proxies';
import {ValidatorType} from '../../providers/validation/validatorType';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {NotifyService} from '../../providers/notification/notify.service';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {EventNames} from '../../shared/events';
import {ImageUploadService} from '../../providers/upload/imageUploadService';
import {AppConsts} from '../../providers/AppConsts';
import * as moment from 'moment';


@IonicPage({
  segment: 'edit-patient/:patientId'
})
@Component({
  selector: 'page-edit-patient',
  templateUrl: 'edit-patient.html',
})
export class EditPatientPage extends BasePage {
  patientId: number;
  getPatientModel: GetPatientDetailsOutput = new GetPatientDetailsOutput();
  editPatientModel: EditPatientDetailsInput = new EditPatientDetailsInput();
  counties: CountyDto[] = [];
  toast;
  birthday: string;
  validationMessages: any;
  @ViewChild(Content) content: Content;
  canSubmit: boolean = true;
  displayDateFormat: string = AppConsts.dateTimePickerDisplayFormat;
  @ViewChild('file') fileInput: any;

  constructor(private _clinicianService: ClinicianServiceProxy,
              private _countyService: CountyServiceProxy,
              private _formValidationService: FormValidationService,
              private _authService: AuthService,
              private _notifyService: NotifyService,
              public events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private _imageUploadService: ImageUploadService) {
    super(_authService, navCtrl, loadingCtrl);

    this.prepareValidationMessages();
    this.getCounties();
    this.createLoader();
  }

  ionViewDidLoad() {
    this.patientId = this.navParams.get('patientId');
    this.loadPatient(this.patientId);
  }
  saveEditPatient(detailsForm: NgForm) {

    if (!this._formValidationService.validateForms([detailsForm])) {
      return;
    }

    this.createLoader();
    this._clinicianService.editPatientDetails(this.editPatientModel)
      .finally(() => this.loader.dismiss())
      .subscribe((result) => {
        if (result) {
          this._notifyService.success('Patient details were successfully edited.');
          this.events.publish(EventNames.PatientEdit);
          this.events.publish(EventNames.PatientEditOnDashboard, true);
          this.navCtrl.pop();
        }
      });
  }
  photoSelected(event): void {

    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.getPatientModel.patientDetails.profileImageUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    this.canSubmit = false;
    this._imageUploadService.upload(event.target.files[0])
      .finally(() => {
      this.canSubmit = true;
      this.editPatientModel.removeProfileImage = false;
    })
      .subscribe(r => this.editPatientModel.profileImageTempName = r.fileName);
  }
  deleteProfilePhoto() {
    this.fileInput.nativeElement.value = '';
    this.editPatientModel.removeProfileImage = true;
    this.getPatientModel.patientDetails.profileImageUrl = null;
  }
  handleChangeDate(event) {
    this.editPatientModel.birthDay = moment(this.birthday);
  }

  private getCounties() {
    this._countyService.getCounties().subscribe((result) => {
      this.counties = result.counties;
    });
  }
  private loadPatient(id: number): void {
    this._clinicianService.getPatientDetails(id)
      .finally(() => this.loader.dismiss())
      .subscribe(result => {
        this.getPatientModel = result;
        this.editPatientModel = new EditPatientDetailsInput();

        this.editPatientModel.init({
          profileImageTempName: null,
          patientId: this.getPatientModel.patientDetails.patientId,
          name: this.getPatientModel.patientDetails.name,
          surname: this.getPatientModel.patientDetails.surname,
          birthDay: this.getPatientModel.patientDetails.birthDay,
          countyId: this.getPatientModel.patientDetails.countyId,
          postCode: this.getPatientModel.patientDetails.postCode,
          address: this.getPatientModel.patientDetails.address,
          emailAddress: this.getPatientModel.patientDetails.emailAddress,
          houseNumber: this.getPatientModel.patientDetails.houseNumber,
          clinicHospitalNumber: this.getPatientModel.patientDetails.clinicHospitalNumber,
          comments: this.getPatientModel.patientDetails.comments,
          gP_Practitioner: this.getPatientModel.patientDetails.gP_Practitioner,
          mobilePhoneNumber: this.getPatientModel.patientDetails.mobilePhoneNumber,
          phoneNumber: this.getPatientModel.patientDetails.phoneNumber,
          workPhoneNumber: this.getPatientModel.patientDetails.phoneNumber,
          removeProfileImage: false
        });

        this.birthday = moment(this.editPatientModel.birthDay).format('YYYY-MM-DD')

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
      birthday: [
        new ValidationMessage(ValidatorType.required)
      ],
      email: [
        new ValidationMessage(ValidatorType.required)
      ],
      houseNumber: [
        new ValidationMessage(ValidatorType.required)
      ],
      address: [
        new ValidationMessage(ValidatorType.required)
      ],
      county: [
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
      NHSNum: [
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

}
