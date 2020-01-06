import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { NobsHeaderComponent } from '../nobs-header/nobs-header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private menu: MenuController) {}

  openMenu() {
    this.menu.open('menu');
  }
}
