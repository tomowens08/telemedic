import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasswordPage } from './reset-password';
import { ComponentsModule } from '../../components/components.module';
import { CustomFormsModule } from 'ng2-validation';
import { DirectivesModule } from "../../shared/directives/directives.module";


@NgModule({
  declarations: [
    ResetPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ResetPasswordPage),
    ComponentsModule,
    CustomFormsModule,
    DirectivesModule
  ],
})
export class ResetPasswordPageModule {}
