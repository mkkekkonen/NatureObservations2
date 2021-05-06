import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

import mig01 from './01-first-migration';

export interface IMigration {
  id: number
  forwards: (a: AbstractDbAdapter) => void,
  backwards: (a: AbstractDbAdapter) => void,
}

export const migrations = [
  mig01,
];
