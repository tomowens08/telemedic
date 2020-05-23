import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { BasePage } from '../../shared/common/basePage';
import {
  BodyPartServiceProxy,
  BodyPartDto,
  GetHasFeedbackBodyPartIdsOutput
} from '../../providers/service-proxies/service-proxies';

@IonicPage({
  segment: 'view-feedback/:patientId'
})
@Component({
  selector: 'page-view-feedback',
  templateUrl: 'view-feedback.html',
})
export class ViewFeedbackPage extends BasePage {

  imageBackAreas: BodyPartDto[] = [];
  imageFrontAreas: BodyPartDto[] =  [];
  bodyPartIdsWithFeedback: GetHasFeedbackBodyPartIdsOutput = new GetHasFeedbackBodyPartIdsOutput();
  markerFront = 2;
  markerBack = 3;
  patientId: number;

  constructor(
      private  _authService: AuthService,
      private  _bodyPartService: BodyPartServiceProxy,
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController
  ) {
    super(_authService, navCtrl, loadingCtrl);
  }

  ionViewDidLoad() {
    this.patientId = this.navParams.get('patientId');

    if(this.patientId == -1){
      this.patientId = undefined;
    }

    this.getBodyParts();
    this.getHasFeedbackBodyPartIds();

  }
  getBodyParts() {
    this.createLoader();
    this._bodyPartService.getBodyParts()
        .finally(() => this.loader.dismiss())
        .subscribe(res => {

          for(let i = 0; i <= res.bodyParts.length - 1; i++) {

            if(res.bodyParts[i].marker == this.markerBack ) {
              this.imageBackAreas.push(res.bodyParts[i]);
            }
            if(res.bodyParts[i].marker == this.markerFront ) {
              this.imageFrontAreas.push(res.bodyParts[i]);
            }

          }

        });
  }
  getHasFeedbackBodyPartIds() {
    // this.createLoader();
    this._bodyPartService.getHasFeedbackBodyPartIds(this.patientId)
        // .finally(() => this.loader.dismiss())
        .subscribe(res => {

          this.bodyPartIdsWithFeedback = res;

        });

  }

}
