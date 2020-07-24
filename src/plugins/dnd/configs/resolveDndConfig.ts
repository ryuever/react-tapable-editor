import { Mode, DNDConfig } from '../../../types';

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

export default (props: DNDConfig) => {
  const next = {
    ...defaultDndConfig,
    ...props,
  } as DNDConfig;
  const o = {} as DNDConfig;

  for (const key in next) {
    if (reservedKeys.indexOf(key) !== -1) {
      o[key] = next[key];
    }
  }

  return o;
};
