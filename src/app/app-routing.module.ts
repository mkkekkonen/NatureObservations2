import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { MyObservationsPage } from './my-observations/my-observations.page';
import { EditObservationPage } from './edit-observation/edit-observation.page';
import { ViewObservationPage } from './view-observation/view-observation.page';
import { CreditsPage } from './credits/credits.page';

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
  {
    path: 'edit-observation/:id',
    component: EditObservationPage,
  },
  {
    path: 'view-observation/:id',
    component: ViewObservationPage,
  },
  {
    path: 'credits',
    component: CreditsPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
