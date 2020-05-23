import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientRegimesPage } from './patient-regimes';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    PatientRegimesPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientRegimesPage),
    ComponentsModule
  ],
})
export class PatientRegimesPageModule {}
