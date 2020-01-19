import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../components/components.module';

import { MapModalPageRoutingModule } from './map-modal-routing.module';

import { MapModalPage } from './map-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    MapModalPageRoutingModule
  ],
  declarations: [MapModalPage],
  exports: [MapModalPage],
})
export class MapModalPageModule {}
