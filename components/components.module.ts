import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { PopoverMenuComponent } from './popover-menu/popover-menu';
import { UserPicComponent } from './user-pic/user-pic';
import { CommonModule } from '@angular/common';
import { ValidationMessageComponent } from './validation-message/validation-message';
import { PatientInfoComponent } from './patient-info/patient-info';
import { AddExerciseComponent } from './add-exercise/add-exercise';
import { HeaderComponent } from './header/header';
import {CustomFormsModule} from 'ng2-validation';
import { ExpandableComponent } from './expandable/expandable';
import { ClinicianHeadPartComponent } from './clinician-head-part/clinician-head-part';
import { DirectivesModule } from '../shared/directives/directives.module';
import { CloseModalComponent } from './close-modal/close-modal';
import { BodyPartsComponent } from './body-parts/body-parts';
import { ClinicianFeedbackAreaComponent } from './clinician-feedback-area/clinician-feedback-area';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
    declarations: [
        PopoverMenuComponent,
        UserPicComponent,
        ValidationMessageComponent,
        PatientInfoComponent,
        AddExerciseComponent,
        HeaderComponent,
        ExpandableComponent,
        ClinicianHeadPartComponent,
        CloseModalComponent,
        BodyPartsComponent,
        ClinicianFeedbackAreaComponent
    ],
	imports: [
	    IonicPageModule,
        CommonModule,
        IonicModule,
        CustomFormsModule,
        DirectivesModule,
        Ng2ChartsModule
  ],
	entryComponents: [
        AddExerciseComponent,
		PopoverMenuComponent,
        ClinicianHeadPartComponent,
        ClinicianFeedbackAreaComponent
	],
	exports: [
	    PopoverMenuComponent,
        UserPicComponent,
        ValidationMessageComponent,
        PatientInfoComponent,
        AddExerciseComponent,
        HeaderComponent,
        ExpandableComponent,
        ClinicianHeadPartComponent,
        CloseModalComponent,
        BodyPartsComponent,
        ClinicianFeedbackAreaComponent
    ]
})
export class ComponentsModule {}
