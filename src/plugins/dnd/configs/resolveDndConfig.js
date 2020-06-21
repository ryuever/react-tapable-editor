export const DNDMode = ["fluid", "snap", "nested"];

const defaultDndConfig = {
  mode: DNDMode[0],
  collisionPadding: 10
};

const reservedKeys = ["mode", "collisionPadding"];

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
