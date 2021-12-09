import { Injectable, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import {
  ObservationGateway,
  ObservationTypeGateway,
  MapLocationGateway,
  ImgDataGateway,
} from './db/gateways';
import { CordovaSqliteAdapter } from './db/adapters';
import { DB_FILE_NAME } from './constants';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private _dbAdapter: CordovaSqliteAdapter;

  private _observationGateway: ObservationGateway;

  private _observationTypeGateway: ObservationTypeGateway;

  private _mapLocationGateway: MapLocationGateway;

  private _imgDataGateway: ImgDataGateway;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.platform.ready().then(() => this.setupAdapter());
  }

  setupAdapter = async () => {
    const db = await this.sqlite.create({
      name: DB_FILE_NAME,
      location: 'default',
    });

    this._dbAdapter = new CordovaSqliteAdapter(db);
  }

  get dbAdapter() {
    return this._dbAdapter;
  }

  get observationGateway() {
    if (!this.dbAdapter) {
      throw new Error('Adapter not ready');
    }

    if (!this._observationGateway) {
      this._observationGateway = new ObservationGateway(this.dbAdapter);
    }
    return this._observationGateway;
  }

  get observationTypeGateway() {
    if (!this.dbAdapter) {
      throw new Error('Adapter not ready');
    }

    if (!this._observationTypeGateway) {
      this._observationTypeGateway = new ObservationTypeGateway(this.dbAdapter);
    }
    return this._observationTypeGateway;
  }

  get mapLocationGateway() {
    if (!this.dbAdapter) {
      throw new Error('Adapter not ready');
    }

    if (!this._mapLocationGateway) {
      this._mapLocationGateway = new MapLocationGateway(this.dbAdapter);
    }
    return this._mapLocationGateway;
  }

  get imgDataGateway() {
    if (!this.dbAdapter) {
      throw new Error('Adapter not ready');
    }

    if (!this._imgDataGateway) {
      this._imgDataGateway = new ImgDataGateway(this.dbAdapter);
    }
    return this._imgDataGateway;
  }
}
