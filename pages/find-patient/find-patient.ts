import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {
  ClinicianServiceProxy, CountyDto, CountyServiceProxy, FindPatientDto, FindPatientDtoStatus,
  FindPatientsInput
} from '../../providers/service-proxies/service-proxies';
import * as moment from 'moment';
import {Pages} from '../pages';
import {AuthService} from '../../providers/auth/auth.service';
import {BasePage} from '../../shared/common/basePage';
import {AppConsts} from '../../providers/AppConsts';


@IonicPage()
@Component({
  selector: 'page-find-patient',
  templateUrl: 'find-patient.html',
})
export class FindPatientPage extends BasePage {

  filterBy: string = 'showAll';
  counties: CountyDto[] = [];
  filter: FindPatientsInput;
  patients: FindPatientDto[] = [];
  birthday: string;
  day: string;
  month: string;
  year: string;

  displayDateFormat: string = AppConsts.dateTimePickerDisplayFormat;

  constructor(public navCtrl: NavController,
              private _countyService: CountyServiceProxy,
              private _clinicianService: ClinicianServiceProxy,
              private _authService: AuthService,
              private loadingCtrl: LoadingController) {
    super(_authService, navCtrl, loadingCtrl);

    this.filter = new FindPatientsInput();
  }

  ionViewDidLoad() {
    this.loadCounties();
    this.search();
  }
  search(): void {
    this._clinicianService.findPatients(this.filter).subscribe(r => {
      this.patients = r.patients;
    });
  }


  clearFilter(): void {
    this.filter.surname = null;
    this.filter.name = null;
    this.filter.birthDay = null;
    this.filter.countyId = null;
    this.filter.postCode = null;
    this.filter.day = null;
    this.filter.month = null;
    this.filter.year = null;
    this.birthday = null;
    this.day = null;
    this.month = null;
    this.year = null;

    this.search();
  }

  filteredPatints(): FindPatientDto[] {
    if (this.filterBy === 'active') {
      return this.patients.filter(p => p.status == FindPatientDtoStatus._1);
    }

    if (this.filterBy === 'discharge') {
      return this.patients.filter(p => p.status == FindPatientDtoStatus._3);
    }

    return this.patients;
  }

  birthDaySelected(): void {
    var m = moment(this.birthday);
    this.filter.birthDay = moment(m).utc().add(m.utcOffset(), 'm');
  }

  daySelected(event): void {
    this.filter.day = event.day;
  }

  monthSelected(event): void {
    this.filter.month = event.month;
  }

  yearSelected(event): void {
    this.filter.year = event.year;
  }

  viewDetails(id: number): void {
    this.navCtrl.push(Pages.PatientDetails, {patientId: id});
  }

  private loadCounties(): void {
    this._countyService.getCounties().subscribe(result => {
      this.counties = result.counties;
    });
  }
}
