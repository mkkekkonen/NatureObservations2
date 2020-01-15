import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { EditObservationPageRoutingModule } from './edit-observation-routing.module';

import { EditObservationPage } from './edit-observation.page';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    EditObservationPageRoutingModule,
  ],
  declarations: [EditObservationPage]
})
export class EditObservationPageModule {}
