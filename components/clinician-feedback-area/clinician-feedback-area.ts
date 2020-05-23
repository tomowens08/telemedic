import { Component, ViewChild } from '@angular/core';
import {
  GetPatientFeedbackByBodyPartOutput,
  BodyPartFeedbackDto,
  FeedbackServiceProxy
} from '../../providers/service-proxies/service-proxies';
import { LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { BaseChartDirective }   from 'ng2-charts/ng2-charts';
import { feedBackChart }   from '../../config/chart.config';
import * as moment from 'moment';

@Component({
  selector: 'clinician-feedback-area',
  templateUrl: 'clinician-feedback-area.html'
})
export class ClinicianFeedbackAreaComponent {

  allFeedbacks: GetPatientFeedbackByBodyPartOutput = new GetPatientFeedbackByBodyPartOutput();
  bodyPartFeedback: BodyPartFeedbackDto[] = [];
  patientId: number;
  bodyPartId: number;
  bodyPartName: string;
  loader;
  lineChartData:Array<any>;
  lineChartLabels:Array<any>;
  lineChartOptions:any = feedBackChart.lineChartOptions;
  lineChartColors: Array<any> = feedBackChart.lineChartColors;
  lineChartLegend:boolean = feedBackChart.lineChartLegend;
  lineChartType:string = feedBackChart.lineChartType;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(
      public _feedbackService: FeedbackServiceProxy,
      public navParams: NavParams,
      private loadingCtrl: LoadingController
  ) {
    this.patientId = navParams.get('patientId');
    this.bodyPartId = navParams.get('bodyPartId');
    this.bodyPartName = navParams.get('bodyAreaName');
    this.getAllPatientFeedbackData();

  }

  createLoader() {
    this.loader = this.loadingCtrl.create({
      content: 'loading'
    });
    this.loader.present();
  }
  createChart(feedbackArr: Array<BodyPartFeedbackDto>) {

    feedbackArr.sort(function(a, b){return a.id - b.id;});
    let dateArray = [],
        aggravationArray = [],
        easeArray = [];

    for (let i = 0; i <= feedbackArr.length - 1; i++) {
      dateArray.push(feedbackArr[i].timestamp.format('YY/MM/DD') );
      aggravationArray.push(feedbackArr[i].aggravation );
      easeArray.push(feedbackArr[i].ease );
    }

    if (this.chart !== undefined) {

      this.chart.datasets = [{
        label: 'Aggravation',
        data: aggravationArray.map(String)
      },{
        label: 'Ease',
        data: easeArray.map(String)
      }];
      this.chart.labels = dateArray;
      this.chart.ngOnInit();
    }

  }
  getAllPatientFeedbackData() {

    this.createLoader();

    this._feedbackService.getPatientFeedbackByBodyPart(this.patientId, this.bodyPartId).subscribe(result => {

      this.allFeedbacks = result;
      this.bodyPartFeedback = this.allFeedbacks.feedbacks;
      this.createChart(this.bodyPartFeedback);
      this.loader.dismiss();

    });
  }

}
