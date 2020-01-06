import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { MyObservationsPageRoutingModule } from './my-observations-routing.module';

import { MyObservationsPage } from './my-observations.page';

import { NobsHeaderComponent } from '../nobs-header/nobs-header.component';
import { ObservationTypeEntryComponent } from '../observation-type-entry/observation-type-entry.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MyObservationsPageRoutingModule
  ],
  declarations: [
    MyObservationsPage,
    NobsHeaderComponent,
    ObservationTypeEntryComponent,
  ],
})
export class MyObservationsPageModule {}
