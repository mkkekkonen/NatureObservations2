import _ from 'lodash';

import { Observation, ImgData, MapLocation } from '../../models';

import { AbstractDbAdapter, GetValuesFn, EditContextFn } from '../adapters/abstract-db-adapter';
import { getInsertClause, getFetchLastIdClause } from '../gateways/abstract-gateway';

import { valueNames as observationValueNames } from '../gateways/observation-gateway';
import { valueNames as imgDataValueNames } from '../gateways/img-data-gateway';
import { valueNames as mapLocationValueNames } from '../gateways/map-location-gateway';

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
