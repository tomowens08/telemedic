import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPatientPage } from './edit-patient';
import { PipesModule } from "../../shared/pipes/pipes.module";
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from "../../shared/directives/directives.module";


@NgModule({
  declarations: [
    EditPatientPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPatientPage),
    PipesModule,
    ComponentsModule,
    DirectivesModule
  ],
})
export class EditPatientPageModule {}
