import { Mode, GlobalConfig } from '../../../types';

const defaultDndConfig = {
  mode: Mode.Fluid,
  collisionPadding: 10,
  withPlaceholder: true,
  isNested: true,
  onDrop: () => {},
};

const reservedKeys = [
  'mode',
  'collisionPadding',
  'withPlaceholder',
  'isNested',
  'onDrop',
];

export default (dndConfig: GlobalConfig) => {
  const next = {
    ...defaultDndConfig,
    ...dndConfig,
  } as GlobalConfig;
  const o = {} as GlobalConfig;

  for (const key in next) {
    if (reservedKeys.indexOf(key) !== -1) {
      o[key] = next[key];
    }
  }

  return o;
};
