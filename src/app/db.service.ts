import { Injectable } from '@angular/core';

import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';

import { Observation, ObservationType, MapLocation, ImgData } from './models';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor() { }

  public async getConnection() {
    try {
      return await getConnection();
    } catch(e) {
      return await this.createConn();
    }
  }

  createConn() {
    return createConnection({
      type: 'cordova',
      database: 'nobs',
      location: 'default',
      synchronize: true,
      logging: ['error', 'query', 'schema'],
      entities: [
        Observation,
        ObservationType,
        MapLocation,
        ImgData,
      ],
    });
  }
}
