import _ from 'lodash';

import { Observation, ImgData, MapLocation } from '../../models';

import { AbstractDbAdapter, GetValuesFn, EditContextFn } from '../adapters/abstract-db-adapter';
import { getInsertClause, getFetchLastIdClause } from '../gateways/abstract-gateway';

import { ObservationGateway, valueNames as observationValueNames } from '../gateways/observation-gateway';
import { ImgDataGateway, valueNames as imgDataValueNames } from '../gateways/img-data-gateway';
import { MapLocationGateway, valueNames as mapLocationValueNames } from '../gateways/map-location-gateway';

export const saveNewObservation = (
  dbAdapter: AbstractDbAdapter,
  observation: Observation,
  imgData: ImgData,
  mapLocation: MapLocation,
) => {
    const sql = [];
    const getValuesFns: GetValuesFn[] = [];
    const editContextFns: EditContextFn[] = [];

    sql.push(getInsertClause('observation', observationValueNames));
    getValuesFns.push(ctx => [observation.title, observation.description, observation.date, observation.type]);
    editContextFns.push((res, ctx) => {});

    sql.push(getFetchLastIdClause('observation'));
    getValuesFns.push(ctx => []);
    editContextFns.push((res, ctx) => {
      const id = res[0].id;
      ctx.observationId = id;
      observation.id = id;
    });

    if (imgData) {
      sql.push(getInsertClause('imgData', imgDataValueNames));
      getValuesFns.push(ctx => [imgData.fileUri, imgData.debugDataUri, ctx.observationId]);
      editContextFns.push((res, ctx) => {});

      sql.push(getFetchLastIdClause('imgData'));
      getValuesFns.push(ctx => []);
      editContextFns.push((res, ctx) => {
        imgData.id = res[0].id;
      });
    }

    if (mapLocation) {
      sql.push(getInsertClause('mapLocation', mapLocationValueNames));
      getValuesFns.push(ctx => {
        return [
          mapLocation.name,
          mapLocation.coords ? mapLocation.coords.latitude : null,
          mapLocation.coords ? mapLocation.coords.longitude : null,
          ctx.observationId,
        ];
      });
      editContextFns.push((res, ctx) => {});

      sql.push(getFetchLastIdClause('mapLocation'));
      getValuesFns.push(ctx => []);
      editContextFns.push((res, ctx) => {
        mapLocation.id = res[0].id;
      });
    }

    return dbAdapter.executeTransactionWithContext(sql, getValuesFns, editContextFns);
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
