import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { MyObservationsPageRoutingModule } from './my-observations-routing.module';

import { MyObservationsPage } from './my-observations.page';

import { ComponentsModule } from '../components/components.module';
import { ObservationCardModule } from '../observation-card/observation-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MyObservationsPageRoutingModule,
    ComponentsModule,
    ObservationCardModule,
  ],
  declarations: [
    MyObservationsPage,
  ],
})
export class MyObservationsPageModule {}
