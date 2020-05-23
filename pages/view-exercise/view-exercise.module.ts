import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewExercisePage } from './view-exercise';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    ViewExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewExercisePage),
    ComponentsModule
  ],
})
export class ViewExercisePageModule {}
