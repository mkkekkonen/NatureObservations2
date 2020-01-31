import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewObservationPage } from './view-observation.page';

const routes: Routes = [
  {
    path: '',
    component: ViewObservationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewObservationPageRoutingModule {}
