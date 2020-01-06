import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyObservationsPage } from './my-observations.page';

const routes: Routes = [
  {
    path: '',
    component: MyObservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyObservationsPageRoutingModule {}
