import { Config, DNDConfig } from '../../../types';

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

export default (configs: Config[], props: DNDConfig) => {
  return configs.map(config => {
    const next = {
      ...props,
      ...defaultConfig,
      ...config,
    } as DNDConfig;
    const o = {} as Config;

    for (const key in next) {
      if (reservedKeys.indexOf(key) !== -1) {
        o[key] = next[key];
      }
    }

    return o;
  });
};
