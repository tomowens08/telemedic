import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindPatientPage } from './find-patient';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from "../../shared/directives/directives.module";

@NgModule({
  declarations: [
    FindPatientPage,
  ],
  imports: [
    IonicPageModule.forChild(FindPatientPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class FindPatientPageModule {}
