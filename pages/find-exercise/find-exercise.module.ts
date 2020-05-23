import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindExercisePage } from './find-exercise';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from "../../shared/directives/directives.module";

@NgModule({
  declarations: [
    FindExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(FindExercisePage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class FindExercisePageModule {}
