import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProgressPage } from './view-progress';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    ViewProgressPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProgressPage),
    ComponentsModule
  ],
})
export class ViewProgressPageModule {}
