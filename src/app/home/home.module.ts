import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { HomePage } from './home.page';

import { NobsHeaderComponent } from '../nobs-header/nobs-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    // RouterModule.forChild([
    //   {
    //     path: '',
    //     component: HomePage
    //   }
    // ])
  ],
  declarations: [HomePage, NobsHeaderComponent]
})
export class HomePageModule {}
