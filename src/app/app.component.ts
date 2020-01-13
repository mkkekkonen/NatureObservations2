import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateService } from '@ngx-translate/core';
import { Repository } from 'typeorm';

import { DbService } from './db.service';
import { ObservationType } from './models/observation-type';

import observationTypes from '../assets/json/observation-types';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages: { text: string, url: string[] }[];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private globalization: Globalization,
    private dbService: DbService,
  ) {
    this.initializeApp();

    this.pages = [
      { text: 'APP.HOME', url: ['/home'] },
    ];
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.translateService.setDefaultLang('fi');

      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage()
          .then(result => result.value.substring(0, 2).toLowerCase())
          .then(code => {
            if (code === 'fi')
              this.setLanguage('fi');
            else
              this.setLanguage('en');
          });
      }

      await this.initializeObservationTypes();
    });
  }

  async initializeObservationTypes() {
    const connection = await this.dbService.getConnection();

    const typeRepository = await connection.getRepository('observationtype') as Repository<ObservationType>;

    if ((await typeRepository.count()) > 0) {
      return;
    }

    const types = observationTypes.map(typeData => {
      const observationType = new ObservationType();
      observationType.name = typeData.name;
      observationType.imageFileName = typeData.icon;
      return observationType;
    });

    await typeRepository.save(types);
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
  }
}
