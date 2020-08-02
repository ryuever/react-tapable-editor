import {
  Config,
  DNDConfig,
  ResultConfig,
  Orientation,
  DefaultConfig,
} from '../../../types';

const defaultConfig: DefaultConfig = {
  orientation: Orientation.Vertical,
};

const reservedKeys = [
  'orientation',
  'draggerHandlerSelector',
  'containerSelector',
  'draggerSelector',
  'shouldAcceptDragger',
  'containerEffect',
  'draggerEffect',
  'impactDraggerEffect',
  'impactContainerEffect',
];

export default (configs: Config[], props: DNDConfig): ResultConfig[] => {
  return configs.map(config => {
    const next = {
      ...props,
      ...defaultConfig,
      ...config,
    } as ResultConfig;
    const o = {} as ResultConfig;

    for (const key in next) {
      if (reservedKeys.indexOf(key) !== -1) {
        o[key] = next[key];
      }
    }

    return o;
  });
};
