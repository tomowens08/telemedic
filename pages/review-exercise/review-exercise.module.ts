import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewExercisePage } from './review-exercise';
import {ChartsModule} from 'ng2-charts';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    ReviewExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewExercisePage),
    ChartsModule,
    ComponentsModule
  ],
})
export class ReviewExercisePageModule {}
