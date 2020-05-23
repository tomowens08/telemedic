import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { DirectivesModule } from "../../shared/directives/directives.module";


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    DirectivesModule
  ],
})
export class LoginPageModule {}
