import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRegimePage } from './create-regime';
import { ComponentsModule } from '../../components/components.module';
import { CustomFormsModule } from '../../shared/ng2-validation/dist/index';
import { DirectivesModule } from "../../shared/directives/directives.module";


@NgModule({
  declarations: [
    CreateRegimePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRegimePage),
    ComponentsModule,
    CustomFormsModule,
    DirectivesModule
  ],
})
export class CreateRegimePageModule {}
