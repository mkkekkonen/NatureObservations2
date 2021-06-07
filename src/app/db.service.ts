import { Injectable } from '@angular/core';

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
  private dbAdapter: CordovaSqliteAdapter;

  private _observationGateway: ObservationGateway;

  private _observationTypeGateway: ObservationTypeGateway;

  private _mapLocationGateway: MapLocationGateway;

  private _imgDataGateway: ImgDataGateway;

  constructor(private sqlite: SQLite) {
    this.setupAdapter();
  }

  setupAdapter = async () => {
    const db = await this.sqlite.create({
      name: DB_FILE_NAME,
      location: 'default',
    });

    this.dbAdapter = new CordovaSqliteAdapter(db);
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
