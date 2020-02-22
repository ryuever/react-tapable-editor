const targetCounter = {};
const sourceCounter = {};

export const keyExtractor = (blockKey, type) => {
  const counter = type === "target" ? targetCounter : sourceCounter;
  const count = counter[blockKey] || 0;
  counter[blockKey] = count + 1;
  return `${type}_${blockKey}_${count}`;
};

export const blockKeyExtractor = listenerKey => {
  const parts = listenerKey.split("_");
  return parts[1];
};
