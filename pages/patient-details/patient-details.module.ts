import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientDetailsPage } from './patient-details';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    PatientDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientDetailsPage),
    ComponentsModule
  ],
})
export class PatientDetailsPageModule {}
