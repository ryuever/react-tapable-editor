export const DNDMode = ["fluid", "snap"];

const defaultDndConfig = {
  mode: DNDMode[0],
  collisionPadding: 10,
  withPlaceholder: true,
  isNested: true
};

const reservedKeys = [
  "mode",
  "collisionPadding",
  "withPlaceholder",
  "isNested"
];

export default dndConfig => {
  const next = {
    ...defaultDndConfig,
    ...dndConfig
  };
  const o = {};

  for (const key in next) {
    if (reservedKeys.indexOf(key) !== -1) {
      o[key] = next[key];
    }
  }

  return o;
};
