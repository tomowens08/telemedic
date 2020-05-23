import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { PipesModule } from "../../shared/pipes/pipes.module";
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DashboardPage
  ],
  entryComponents: [
    DashboardPage
  ],
  providers: [
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    PipesModule,
    ComponentsModule
  ],
})
export class DashboardPageModule {}
