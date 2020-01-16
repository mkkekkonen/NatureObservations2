import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservationTypeModalPage } from './observation-type-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ObservationTypeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationTypeModalPageRoutingModule {}
