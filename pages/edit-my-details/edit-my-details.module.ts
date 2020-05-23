import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditMyDetailsPage } from './edit-my-details';
import { ComponentsModule } from '../../components/components.module';
import { CustomFormsModule } from 'ng2-validation';
import { DirectivesModule } from "../../shared/directives/directives.module";

@NgModule({
  declarations: [
    EditMyDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EditMyDetailsPage),
    ComponentsModule,
    CustomFormsModule,
    DirectivesModule
  ],
})
export class EditMyDetailsPageModule {}
