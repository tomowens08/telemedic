import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from '../../providers/auth/auth.service';
import {BasePage} from '../../shared/common/basePage';
import {
  ClinicianGeneralInfoDto, ClinicianServiceProxy, CountyDto, CountyServiceProxy,
  EditClinicianDetailsInput
} from '../../providers/service-proxies/service-proxies';
import {ValidationMessage} from '../../providers/validation/validationMessage';
import {ValidatorType} from '../../providers/validation/validatorType';
import {NgForm} from '@angular/forms';
import {FormValidationService} from '../../providers/validation/formValidation.service';
import {NotifyService} from '../../providers/notification/notify.service';
import {ImageUploadService} from '../../providers/upload/imageUploadService';
import {EventNames} from '../../shared/events';

@IonicPage()
@Component({
  selector: 'page-edit-my-details',
  templateUrl: 'edit-my-details.html',
})
export class EditMyDetailsPage extends BasePage {

  validationMessages: any;
  model: EditClinicianDetailsInput = new EditClinicianDetailsInput();
  generalInfo: ClinicianGeneralInfoDto = new ClinicianGeneralInfoDto();
  counties: CountyDto [] = [];
  canSubmit: boolean = true;
  @ViewChild('file') fileInput: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _clinicianService: ClinicianServiceProxy,
              private _countyService: CountyServiceProxy,
              private _formValidationService: FormValidationService,
              private _notifyService: NotifyService,
              private _imageUploadService: ImageUploadService,
              private _events: Events) {
    super(_authService, navCtrl, _loadingCtrl);

    this.prepareValidationMessages();
  }

  ionViewDidLoad() {
    this.loadProfile();
    this.loadCounties();
  }

  photoSelected(event): void {
    this.canSubmit = false;
    this._imageUploadService.upload(event.target.files[0])
        .finally(() => {
          this.canSubmit = true;
          this.model.removeProfileImage = false;
        })
      .subscribe(r => {
        this.model.profileImageTempName = r.fileName;
        this.generalInfo.profileImageUrl = r.uri;
      });
  }
  deleteProfilePhoto() {
    this.fileInput.nativeElement.value = '';
    this.model.removeProfileImage = true;
    this.generalInfo.profileImageUrl = null;
  }
  save(form: NgForm): void{
    if(!this._formValidationService.validateForms([form])){
      return;
    }

    this.createLoader();

    this._clinicianService.editClinicianDetails(this.model)
      .finally(()=> this.loader.dismiss())
      .subscribe(()=> {
        this._notifyService.success('Profile data was updated!');
        this._events.publish(EventNames.EditMyDetails);
      });
  }

  private loadProfile(): void {
    this._clinicianService.getClinicianGeneralInfo()
      .subscribe(res => {
          this.generalInfo = res;

          this.model.init({
            houseNumber: res.houseNumber,
            address: res.address,
            countyId: res.countyId,
            postCode: res.postCode,
            phoneNumber: res.phoneNumber,
            workPhoneNumber: res.workPhoneNumber,
            mobilePhoneNumber: res.mobilePhoneNumber,
            emailAddress: res.emailAddress,
            removeProfileImage: false
          });
      });
  }

  private loadCounties(): void {
    this._countyService.getCounties().subscribe(result => {
      this.counties = result.counties;
    });
  }

  private prepareValidationMessages(): void {
      this.validationMessages = {
        house: [
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
        mobilePhoneNumber: [
          new ValidationMessage(ValidatorType.required)
        ],
        emailAddress: [
          new ValidationMessage(ValidatorType.required),
          new ValidationMessage(ValidatorType.email, 'Email is invalid')
        ]
      };
  }
}
