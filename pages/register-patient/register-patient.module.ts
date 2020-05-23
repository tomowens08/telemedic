import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPatientPage } from './register-patient';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from "../../shared/directives/directives.module";


@NgModule({
  declarations: [
    RegisterPatientPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterPatientPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class RegisterPatientPageModule {}
