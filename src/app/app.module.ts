import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ComponentsModule } from './components/components.module';
import { MyObservationsPageModule } from './my-observations/my-observations.module';
import { EditObservationPageModule } from './edit-observation/edit-observation.module';
import { ViewObservationPageModule } from './view-observation/view-observation.module';
import { CreditsPageModule } from './credits/credits.module';
import { DebugPageModule } from './debug/debug.module';

import secrets from './secrets.json';

export const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, 'assets/i18n/', '.json');

const bugsnagClient = bugsnag(secrets.bugsnagApiKey);
const errorHandlerFactory = () => new BugsnagErrorHandler(bugsnagClient);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ComponentsModule,
    MyObservationsPageModule,
    EditObservationPageModule,
    ViewObservationPageModule,
    CreditsPageModule,
    DebugPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Globalization,
    TranslateService,
    TranslateStore,
    HttpClient,
    Camera,
    FilePath,
    Geolocation,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useFactory: errorHandlerFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
