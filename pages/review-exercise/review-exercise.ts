import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {BasePage} from '../../shared/common/basePage';
import {AuthService} from '../../providers/auth/auth.service';
import {
  ExercisePerformanceServiceProxy,
  RegimeExercsiseReviewOutput
} from '../../providers/service-proxies/service-proxies';

import * as moment from 'moment';
import {Range} from '../../models/range';

@IonicPage({
  segment: 'review-exercise/:id'
})
@Component({
  selector: 'page-review-exercise',
  templateUrl: 'review-exercise.html',
})
export class ReviewExercisePage extends BasePage {

  exerciseId: number;
  exerciseData: RegimeExercsiseReviewOutput = new RegimeExercsiseReviewOutput();
  lineChart: any = {};
  barChart: any = {};
  isShowChart: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _authService: AuthService,
              private _loadingCtrl: LoadingController,
              private _exercisePerformanceService: ExercisePerformanceServiceProxy) {
    super(_authService, navCtrl, _loadingCtrl);

    this.setupLineChartOptions();
    this.setupBarChartOptions();
  }


  ionViewDidEnter() {
    this.exerciseId = this.navParams.get('id');
    this.loadExercise();
  }

  private loadExercise(): void {
    this.createLoader();

    this._exercisePerformanceService.getRegimeExerciseProgress(this.exerciseId)
      .finally(() => this.loader.dismiss())
      .subscribe(res => {
        this.exerciseData = res;

        this.prepareLineChartData();
        this.prepareBarChartData();

        this.isShowChart = true;
      });
  }

  private setupLineChartOptions(): void {
    this.lineChart.chartData = [
      {
        data: [],
        lineTension: 0
      }
    ];

    this.lineChart.chartColors = [
      {
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(114,206,107,1)',
      }
    ];

    this.lineChart.ChartLegend = false;
    this.lineChart.ChartType = 'line';
  }

  private prepareLineChartData(): void {

    let data = this.exerciseData.performance.map(p => {
      return {
        x: p.timestamp,
        y: p.score
      }
    });

    this.lineChart.chartData = [{
      data: data,
      lineTension: 0
    }];

    let dateRange = this.getChartMinMax(data);

    this.lineChart.chartOptions = this.getBarChartOptions(dateRange.min, dateRange.max);

  }

  private setupBarChartOptions(): void {
    this.barChart.data = [
      {
        data: []
      }
    ];

    this.barChart.colors = [
      {
        backgroundColor: 'rgba(46,204,113,1)'
      },
      {
        backgroundColor: 'rgba(231,76,60,0.5)'
      }
    ];

    this.barChart.type = 'bar';
    this.barChart.legend = false;
  }


  private prepareBarChartData(): void {

    let data = this.exerciseData.performance.map(p => {
      return {
        x: p.timestamp,
        y: p.achived,
      }
    });

    let dateRange = this.getChartMinMax(data);

    this.barChart.options = this.getBarChartOptions(dateRange.min, dateRange.max);

    this.barChart.data = [
      {
        data: data
      }
    ];
  }

  private getBarChartOptions(min?, max?){

    let options = {
      scaleShowVerticalLines: false,
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false
      },
      scales: {
        xAxes: [{
          maxBarThickness: 35,
          type: 'time',
          distribution: 'series',
          bounds: 'ticks',
          ticks: {
            source: 'data'
          },
          time: {
            unit: 'day',
            min: min,
            max: max,
            tooltipFormat: 'lll',
          }
        }],
        yAxes: [{
          ticks:{
            min: 0,
            //max: 100
          }
        }]
      }
    };

    if(min){
      options.scales.xAxes[0].time.min = min;
    }

    if(max){
      options.scales.xAxes[0].time.max = max;
    }

    return options;
  }

  private getChartMinMax(data): Range<Date>{
    let range = new Range<Date>();

    if(data.length > 0){
      range.min = moment(data[0].x).add(-1, 'd').toDate();
      range.max = moment(data[data.length - 1].x).add(1, 'd').toDate();
    }

    return range;
  }
}
