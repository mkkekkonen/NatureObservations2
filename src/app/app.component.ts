import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateService } from '@ngx-translate/core';

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
  ) {
    this.initializeApp();

    this.pages = [
      { text: 'APP.HOME', url: ['/home'] },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
    });
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
  }
}
