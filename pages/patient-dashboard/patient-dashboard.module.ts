import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientDashboardPage } from './patient-dashboard';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    PatientDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientDashboardPage),
    ComponentsModule
  ],
})
export class PatientDashboardPageModule {}
