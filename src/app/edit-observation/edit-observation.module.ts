import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { EditObservationPageRoutingModule } from './edit-observation-routing.module';

import { EditObservationPage } from './edit-observation.page';
import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal.page';
import { ObservationTypeModalPageModule } from '../observation-type-modal/observation-type-modal.module';
import { ComponentsModule } from '../components/components.module';
import { MapModalPageModule } from '../map-modal/map-modal.module';
import { MapModalPage } from '../map-modal/map-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    ObservationTypeModalPageModule,
    MapModalPageModule,
    EditObservationPageRoutingModule,
  ],
  declarations: [EditObservationPage],
  entryComponents: [
    ObservationTypeModalPage,
    MapModalPage,
  ],
})
export class EditObservationPageModule {}
