import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DischargePatientPage } from './discharge-patient';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    DischargePatientPage,
  ],
  imports: [
    IonicPageModule.forChild(DischargePatientPage),
    ComponentsModule
  ],
})
export class DischargePatientPageModule {}
