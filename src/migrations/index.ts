import * as migration_20260914_121053_baseline from './20260914_121053_baseline';
import * as migration_20260914_121251_editable_landing from './20260914_121251_editable_landing';

export const migrations = [
  {
    up: migration_20260914_121053_baseline.up,
    down: migration_20260914_121053_baseline.down,
    name: '20260914_121053_baseline',
  },
  {
    up: migration_20260914_121251_editable_landing.up,
    down: migration_20260914_121251_editable_landing.down,
    name: '20260914_121251_editable_landing'
  },
];
