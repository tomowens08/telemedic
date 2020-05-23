import { Component } from '@angular/core';
import { LoadingController, NavParams } from 'ionic-angular';
import {
  BodyPartServiceProxy,
  Marker,
  GetBodyPartsByMarkerOutput
} from '../../providers/service-proxies/service-proxies';

@Component({
  selector: 'clinician-head-part',
  templateUrl: 'clinician-head-part.html'
})
export class ClinicianHeadPartComponent {

  headArea: GetBodyPartsByMarkerOutput = new GetBodyPartsByMarkerOutput();
  imageTensionAreas = [];
  imageClusterAreas = [];
  imageNeckAreas = [];
  imageMigraineAreas = [];
  patientId: number;
  bodyPartId: number;
  bodyPartIdsWithFeedback: number[];
  markerHead: Marker = 1;
  loader;

  constructor(
      private loadingCtrl: LoadingController,
      public navParams: NavParams,
      private  _bodyPartService: BodyPartServiceProxy,
  ) {
    this.patientId = navParams.get('patientId');
    this.bodyPartId = navParams.get('bodyPartId');
    this.bodyPartIdsWithFeedback = navParams.get('bodyPartIdsWithFeedback');
    this.headArea = new GetBodyPartsByMarkerOutput();
    this.headArea.bodyParts = [];

    this.getHeadParts();
  }

  getHeadParts() {

    this.loader = this.loadingCtrl.create({
      content: 'loading'
    });
    this.loader.present();

    this._bodyPartService.getBodyPartsByMarker(this.markerHead)
        .finally(() => this.loader.dismiss())
        .subscribe(res => {
      this.headArea = res;
    });
  }

}
