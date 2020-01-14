import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { MyObservationsPageRoutingModule } from './my-observations-routing.module';

import { MyObservationsPage } from './my-observations.page';

import { ObservationTypeEntryComponent } from '../observation-type-entry/observation-type-entry.component';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MyObservationsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    MyObservationsPage,
    ObservationTypeEntryComponent,
  ],
})
export class MyObservationsPageModule {}
