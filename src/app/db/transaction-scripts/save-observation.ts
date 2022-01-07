import _ from 'lodash';

import { Observation, ImgData, MapLocation } from '../../models';

import { AbstractDbAdapter, GetValuesFn, EditContextFn } from '../adapters/abstract-db-adapter';
import { getInsertClause, getUpdateClause } from '../gateways/abstract-gateway';
import { getUpdateObservationIdClause } from '../gateways/abstract-observation-data-gateway';

import { ObservationGateway, valueNames as observationValueNames } from '../gateways/observation-gateway';
import { ImgDataGateway, valueNames as imgDataValueNames } from '../gateways/img-data-gateway';
import { MapLocationGateway, valueNames as mapLocationValueNames } from '../gateways/map-location-gateway';

interface IIds {
  observationId?: number
  imgDataId?: number
  mapLocationId?: number
}

const getObservationValues = (observation: Observation) =>
  [observation.title, observation.description, observation.date, observation.type];

const getImgDataValues = (imgData: ImgData, observationId: number = null) =>
  [imgData.fileUri, imgData.debugDataUri, observationId];

const getMapLocationValues = (mapLocation: MapLocation, observationId: number = null) =>
  [
    mapLocation.name,
    mapLocation.coords ? mapLocation.coords.latitude : null,
    mapLocation.coords ? mapLocation.coords.longitude : null,
    observationId,
  ];

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
  getValuesFns.push(ctx => getObservationValues(observation));
  editContextFns.push((res, id, ctx) => {
    observation.id = id;
    ids.observationId = id;
  });

  if (imgData) {
    sql.push(getInsertClause('imgData', imgDataValueNames));
    getValuesFns.push(ctx => getImgDataValues(imgData));
    editContextFns.push((res, id, ctx) => {
      imgData.id = id;
      imgData.observationId = ids.observationId;
      ids.imgDataId = id;
    });
  }

  if (mapLocation) {
    sql.push(getInsertClause('mapLocation', mapLocationValueNames));
    getValuesFns.push(ctx => getMapLocationValues(mapLocation));
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

const updateObservationData = (
  dbAdapter: AbstractDbAdapter,
  observation: Observation,
  imgData: ImgData,
  mapLocation: MapLocation,
  ids: IIds,
) => {
  
  const sql = [];
  const getValuesFns: GetValuesFn[] = [];
  const editContextFns: EditContextFn[] = [];

  sql.push(getUpdateClause('observation', observationValueNames));
  getValuesFns.push(ctx => getObservationValues(observation));
  editContextFns.push(() => {});

  const imgDataValues = imgData && getImgDataValues(imgData, observation.id);
  const mapLocationValues = mapLocation && getMapLocationValues(mapLocation, observation.id);

  if (imgData && !imgData.id) {
    sql.push(getInsertClause('imgData', imgDataValueNames));
    getValuesFns.push(ctx => imgDataValues);
    editContextFns.push((res, id, ctx) => {
      imgData.id = id;
      ids.imgDataId = id;
    });
  } else if (imgData && imgData.id) {
    sql.push(getUpdateClause('imgData', imgDataValueNames));
    getValuesFns.push(ctx => [...imgDataValues, imgData.id]);
    editContextFns.push(() => {});
  }

  if (mapLocation && !mapLocation.id) {
    sql.push(getInsertClause('mapLocation', mapLocationValueNames));
    getValuesFns.push(ctx => mapLocationValues);
    editContextFns.push((res, id, ctx) => {
      mapLocation.id = id;
      ids.mapLocationId = id;
    });
  } else if (mapLocation && mapLocation.id) {
    sql.push(getUpdateClause('mapLocation', mapLocationValueNames));
    getValuesFns.push(ctx => [...mapLocationValues, mapLocation.id]);
    editContextFns.push(() => {});
  }

  return dbAdapter.executeTransactionWithContext(sql, getValuesFns, editContextFns);
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

export const updateObservation = async (
  dbAdapter: AbstractDbAdapter,
  observation: Observation,
  imgData: ImgData,
  mapLocation: MapLocation,
) => {
  const ids: IIds = { observationId: observation.id };

  await updateObservationData(dbAdapter, observation, imgData, mapLocation, ids);
  await updateObservationIds(dbAdapter, ids);
};
