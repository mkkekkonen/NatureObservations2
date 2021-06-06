import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

import mig01 from './01-first-migration';
import mig02 from './02-observation-type-str';
import mig03 from './03-move-foreign-keys';

export interface IMigration {
  id: number
  forwards: (a: AbstractDbAdapter) => Promise<void>,
  backwards: (a: AbstractDbAdapter) => Promise<void>,
}

export const migrations = [
  mig01,
  mig02,
  mig03,
];
