import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPasswordPage } from './forgot-password';
import { ComponentsModule } from '../../components/components.module';
import { CustomFormsModule } from 'ng2-validation';
import { DirectivesModule } from "../../shared/directives/directives.module";


@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordPage),
    ComponentsModule,
    CustomFormsModule,
    DirectivesModule
  ]
})
export class ForgotPasswordPageModule {}
