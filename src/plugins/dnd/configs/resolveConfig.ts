import { Config, GlobalConfig } from '../../../types';

const defaultConfig = {
  // orientation of container, could be `vertical` or `horizontal`
  orientation: 'vertical',
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
];

export default (configs: Config[], globalConfigs: GlobalConfig) => {
  return configs.map(config => {
    const next = {
      ...globalConfigs,
      ...defaultConfig,
      ...config,
    } as GlobalConfig;
    const o = {} as Config;

    for (const key in next) {
      if (reservedKeys.indexOf(key) !== -1) {
        o[key] = next[key];
      }
    }

    return o;
  });
};
