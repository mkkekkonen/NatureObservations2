import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Observation, ImgData, MapLocation } from '../models';
import { DbService } from '../db.service';

import { CordovaSqliteAdapter } from './adapters';
import { saveNewObservation } from './transaction-scripts';

@Injectable({
  providedIn: 'root'
})
export class TransactionScriptRunnerService {
  adapter: CordovaSqliteAdapter;

  constructor(private dbService: DbService) {}

  saveNewObservation = async (
    observation: Observation,
    imgData: ImgData,
    mapLocation: MapLocation,
   ) => {
    saveNewObservation(
       this.dbService.dbAdapter,
       observation,
       imgData,
       mapLocation,
     )
   }
}
