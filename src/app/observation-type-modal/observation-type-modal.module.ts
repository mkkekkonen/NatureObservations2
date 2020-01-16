import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ObservationTypeModalPageRoutingModule } from './observation-type-modal-routing.module';

import { ObservationTypeModalPage } from './observation-type-modal.page';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    ObservationTypeModalPageRoutingModule
  ],
  declarations: [ObservationTypeModalPage],
  exports: [ObservationTypeModalPage],
})
export class ObservationTypeModalPageModule {}
