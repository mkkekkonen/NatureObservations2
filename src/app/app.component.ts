import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateService } from '@ngx-translate/core';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { DbService } from './db.service';
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
  ) {
    this.initializeApp();

    this.pages = [
      { text: 'APP.HOME', url: ['/home'] },
      { text: 'APP.NEWOBS', url: ['/edit-observation'] },
      { text: 'APP.CREDITS', url: ['/credits'] },
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
      // await this.initializeObservations();
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

  async initializeObservations() {
    const connection = await this.dbService.getConnection();

    const observationRepository = await connection.getRepository('observation') as Repository<Observation>;
    const observationTypeRepository = await connection.getRepository('observationtype') as Repository<ObservationType>;
    const mapLocationRepository = await connection.getRepository('maplocation') as Repository<MapLocation>;

    if ((await observationRepository.count() > 0)) {
      return;
    }

    const obsType = await observationTypeRepository.findOne();

    const observation = new Observation();
    observation.title = 'Testi';
    observation.description = 'Testi';
    observation.date = moment.default().format('YYYY-MM-DD HH:mm:ss');
    observation.type = obsType;

    const mapLocation = new MapLocation();
    mapLocation.name = 'Mansesteri';
    mapLocation.latitude = 61.497480;
    mapLocation.longitude = 23.757250;
    mapLocation.observation = observation;

    await observationRepository.save(observation);
    await mapLocationRepository.save(mapLocation);
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
  }
}
