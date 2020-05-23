import { Component, Input, AfterContentChecked } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ClinicianHeadPartComponent } from '../clinician-head-part/clinician-head-part';
import { ClinicianFeedbackAreaComponent } from '../clinician-feedback-area/clinician-feedback-area';
declare let $ :any;

@Component({
  selector: 'body-parts',
  templateUrl: 'body-parts.html',
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class BodyPartsComponent implements AfterContentChecked {

  canInitMapsters: boolean = true;
  @Input() Areas;
  @Input() mapName;
  @Input() srcPath;
  @Input() part;
  @Input() patientId;
  @Input() bodyPartId;
  @Input() bodyPartIdsWithFeedback;

  constructor(
      public modalCtrl: ModalController
  ) {}

  ngAfterContentChecked() {

    if(this.part != 'head') {

      if(this.canInitMapsters && this.Areas.length) {

        this.initMapsters();

      }

    } else {

      if(this.canInitMapsters && !(this.isEmpty(this.Areas))) {

        this.initMapsters();

      }

    }

  }

  isEmpty(obj) {
    for(let prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }
  onResize() {
    this.resizeMapsters();
  }
  initMapsters() {
    let self = this;

    setTimeout(()=>{
      $('#' + this.mapName).mapster({
        singleSelect: false,
        fill : true,
        fade: true,
        fadeDuration: 550,
        scaleMap: true,
        fillOpacity : 1,
        fillColor: '000000',
        onMouseover: function(data) {
          $(this).mapster('set',true);
          self.createHighlightAreas();
        },
        onMouseout: function(data) {
          $(this).mapster('set',false);
          self.createHighlightAreas();
        }
      });
      self.createHighlightAreas();
      self.resizeMapsters();
    }, 1);

    this.canInitMapsters = false;

  }
  resizeMapsters() {
    $('#' + this.mapName).mapster('resize', $('#' + this.mapName).parents('.body-parts').width(), 0, 10);
  }
  createHighlightAreas() {

    if(this.bodyPartIdsWithFeedback) {
      for(let i = 0; i <= this.bodyPartIdsWithFeedback.length - 1; i++) {
        $('area.' + this.bodyPartIdsWithFeedback[i]).mapster('set',true);

        if(this.bodyPartIdsWithFeedback[i]>68) {
          $('area.' + 68).mapster('set',true);
        }

      }
    }

  }
  onAreaClick(event) {

    console.log(event.target.id);

    this.createHighlightAreas();
    this.resizeMapsters();
    this.openModalWithHead(
        event.target.id,
        event.target.attributes['data-bodyid'].nodeValue,
        event.target.attributes['data-name'].nodeValue
    );
  }
  openModalWithHead(id: number, bodyPartId: number, name: string) {

    if(id == 68) {

      let modal = this.modalCtrl.create(ClinicianHeadPartComponent, {
        patientId: this.patientId,
        bodyPartId: bodyPartId,
        bodyPartIdsWithFeedback: this.bodyPartIdsWithFeedback
      });
      modal.present();

    } else {

      let modal = this.modalCtrl.create(ClinicianFeedbackAreaComponent, {
        patientId: this.patientId,
        bodyPartId: bodyPartId,
        bodyAreaName: name
      });
      modal.present();

    }

  }

}
