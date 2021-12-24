import _ from 'lodash';

import { Observation, ImgData, MapLocation } from '../../models';

import { AbstractDbAdapter, GetValuesFn, EditContextFn } from '../adapters/abstract-db-adapter';
import { getInsertClause } from '../gateways/abstract-gateway';
import { getUpdateObservationIdClause } from '../gateways/abstract-observation-data-gateway';

import { ObservationGateway, valueNames as observationValueNames } from '../gateways/observation-gateway';
import { ImgDataGateway, valueNames as imgDataValueNames } from '../gateways/img-data-gateway';
import { MapLocationGateway, valueNames as mapLocationValueNames } from '../gateways/map-location-gateway';

interface IIds {
  observationId?: number
  imgDataId?: number
  mapLocationId?: number
}

const saveObservationData = async (
  dbAdapter: AbstractDbAdapter,
  observation: Observation,
  imgData: ImgData,
  mapLocation: MapLocation,
  ids: IIds,
) => {
  const sql = [];
  const getValuesFns: GetValuesFn[] = [];
  const editContextFns: EditContextFn[] = [];

  sql.push(getInsertClause('observation', observationValueNames));
  getValuesFns.push(ctx => [observation.title, observation.description, observation.date, observation.type]);
  editContextFns.push((res, id, ctx) => {
    observation.id = id;
    ids.observationId = id;
  });

  if (imgData) {
    sql.push(getInsertClause('imgData', imgDataValueNames));
    getValuesFns.push(ctx => [imgData.fileUri, imgData.debugDataUri, null]);
    editContextFns.push((res, id, ctx) => {
      imgData.id = id;
      imgData.observationId = ids.observationId;
      ids.imgDataId = id;
    });
  }

  if (mapLocation) {
    sql.push(getInsertClause('mapLocation', mapLocationValueNames));
    getValuesFns.push(ctx => {
      return [
        mapLocation.name,
        mapLocation.coords ? mapLocation.coords.latitude : null,
        mapLocation.coords ? mapLocation.coords.longitude : null,
        null,
      ];
    });
    editContextFns.push((res, id, ctx) => {
      mapLocation.id = id;
      mapLocation.observationId = ids.observationId;
      ids.mapLocationId = id;
    });
  }

  return dbAdapter.executeTransactionWithContext(sql, getValuesFns, editContextFns);
};

const updateObservationIds = async (dbAdapter: AbstractDbAdapter, ids: IIds) => {
  const sql = [];
  const values = [];

  if (ids.imgDataId) {
    sql.push(getUpdateObservationIdClause('imgData'));
    values.push([ids.observationId, ids.imgDataId])
  }

  if (ids.mapLocationId) {
    sql.push(getUpdateObservationIdClause('mapLocation'));
    values.push([ids.observationId, ids.mapLocationId]);
  }

  return dbAdapter.executeTransaction(sql, values);
};

export const saveNewObservation = async (
  dbAdapter: AbstractDbAdapter,
  observation: Observation,
  imgData: ImgData,
  mapLocation: MapLocation,
) => {
  const ids: IIds = {};

  await saveObservationData(dbAdapter, observation, imgData, mapLocation, ids);
  await updateObservationIds(dbAdapter, ids);
};

export const saveNewObservationManual = async (
  observation: Observation,
  imgData: ImgData,
  mapLocation: MapLocation,
  observationGateway: ObservationGateway,
  imgDataGateway: ImgDataGateway,
  mapLocationGateway: MapLocationGateway,
) => {
  let observationId;

  try {
    await observationGateway.insert(observation);
    observationId = observation.id;
  } catch (e) {
    window.alert('Error saving observation: ' + e.message + '\n' + e.stack);
    return false;
  }

  if (imgData) {
    try {
      imgData.observationId = observationId;
      await imgDataGateway.insert(imgData);
    } catch (e) {
      await observationGateway.delete(observationId);
      window.alert('Error saving image data: ' + e.message);
      return false;
    }
  }

  if (mapLocation) {
    try {
      mapLocation.observationId = observationId;
      await mapLocationGateway.insert(mapLocation);
    } catch (e) {
      await observationGateway.delete(observationId);
      if (imgData) {
        await imgDataGateway.deleteByObservationId(observationId);
      }
      window.alert('Error saving location data: ' + e.message);
      return false;
    }
  }

  return true;
};
