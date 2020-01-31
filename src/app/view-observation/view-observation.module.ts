import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ViewObservationPageRoutingModule } from './view-observation-routing.module';

import { ViewObservationPage } from './view-observation.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ViewObservationPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ViewObservationPage]
})
export class ViewObservationPageModule {}
