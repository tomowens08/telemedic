import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewRegimesPage } from './view-regimes';
import { PipesModule } from "../../shared/pipes/pipes.module";
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    ViewRegimesPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewRegimesPage),
    PipesModule,
    ComponentsModule
  ],
})
export class ViewRegimesPageModule {}
