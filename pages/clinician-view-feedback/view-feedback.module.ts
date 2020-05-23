import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewFeedbackPage } from './view-feedback';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../shared/directives/directives.module';

@NgModule({
  declarations: [
    ViewFeedbackPage
  ],
  imports: [
    IonicPageModule.forChild(ViewFeedbackPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class ViewFeedbackPageModule {}
