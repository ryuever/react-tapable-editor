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

export default (configs, globalConfigs) => {
  return configs.map(config => {
    const next = {
      ...globalConfigs,
      ...defaultConfig,
      ...config,
    };
    const o = {};

    for (const key in next) {
      if (reservedKeys.indexOf(key) !== -1) {
        o[key] = next[key];
      }
    }

    return o;
  });
};
