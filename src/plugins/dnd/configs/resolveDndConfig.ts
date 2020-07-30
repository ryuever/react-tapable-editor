import { Mode, DNDConfig, ResultDNDConfig } from '../../../types';

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

export default (props: DNDConfig): ResultDNDConfig => {
  const next: ResultDNDConfig = {
    ...defaultDndConfig,
    ...props,
  };
  const o = {} as ResultDNDConfig;

  for (const key in next) {
    if (reservedKeys.indexOf(key) !== -1) {
      o[key] = next[key];
    }
  }

  return o;
};
