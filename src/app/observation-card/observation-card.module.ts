import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ObservationCardComponent } from './observation-card.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [ObservationCardComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
  ],
  exports: [ObservationCardComponent]
})
export class ObservationCardModule { }
