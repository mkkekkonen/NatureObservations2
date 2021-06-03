import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateService } from '@ngx-translate/core';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { DbService } from './db.service';
import { MigrationRunnerService } from './db/migration-runner.service';
import { ObservationType, Observation, MapLocation } from './models';

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
    private migrationRunnerService: MigrationRunnerService,
  ) {
    this.initializeApp();

    this.pages = [
      { text: 'APP.HOME', url: ['/home'] },
      { text: 'APP.NEWOBS', url: ['/edit-observation'] },
      { text: 'APP.CREDITS', url: ['/credits'] },
      { text: 'APP.DEBUG', url: ['/debug'] }
    ];
  }

  async initializeApp() {
    await this.platform.ready();

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    this.translateService.setDefaultLang('fi');

    if ((<any>window).cordova) {
      const language = await this.globalization.getPreferredLanguage();
      const code = language.value.substring(0, 2).toLowerCase();
      if (code === 'fi')
        this.setLanguage('fi');
      else
        this.setLanguage('en');
    }

    await this.migrationRunnerService.runMigrations();

    await this.initializeObservationTypes();
    // await this.initializeObservations();
  }

  async initializeObservationTypes() {
    const existingTypes = await this.dbService.observationTypeGateway.getAll();
    if (existingTypes.length === 0) {
      await Promise.all(observationTypes.map(typeData => {
        const type = new ObservationType(typeData.name, typeData.icon);
        return this.dbService.observationTypeGateway.insert(type);
      }));
    }
  }

  // async initializeObservations() {
    // const mapLocation = new MapLocation('Mansesteri', 61.497480, 23.757250);
    // await this.dbService.mapLocationGateway.insert(mapLocation);

    // const observation = new Observation('Testi', 'Testi', moment.default(), 'LANDSCAPE', mapLocation.id, null);
    // await this.dbService.observationGateway.insert(observation);
  // }

  setLanguage(lang: string) {
    this.translateService.use(lang);
  }
}
