import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { MyObservationsPage } from './my-observations/my-observations.page';
import { EditObservationPage } from './edit-observation/edit-observation.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: MyObservationsPage,
  },
  {
    path: 'edit-observation',
    component: EditObservationPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
