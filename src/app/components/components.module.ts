import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { NobsHeaderComponent } from '../nobs-header/nobs-header.component';
import { ObservationTypeEntryComponent } from '../observation-type-entry/observation-type-entry.component';

@NgModule({
  declarations: [
    NobsHeaderComponent,
    ObservationTypeEntryComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  exports: [
    NobsHeaderComponent,
    ObservationTypeEntryComponent,
  ]
})
export class ComponentsModule { }
