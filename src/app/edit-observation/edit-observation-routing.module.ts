import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditObservationPage } from './edit-observation.page';

const routes: Routes = [
  {
    path: '',
    component: EditObservationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditObservationPageRoutingModule {}
