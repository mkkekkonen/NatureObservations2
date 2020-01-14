import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { NobsHeaderComponent } from '../nobs-header/nobs-header.component';

@NgModule({
  declarations: [NobsHeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  exports: [
    NobsHeaderComponent,
  ]
})
export class ComponentsModule { }
