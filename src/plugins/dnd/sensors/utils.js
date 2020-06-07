import closest from "../closest";

export const hasDraggerHandlerMatched = (el, configs) => {
  const len = configs.length;
  for (let i = 0; i < len; i++) {
    const { draggerHandlerSelector } = configs[i];
    if (closest(el, draggerHandlerSelector)) return true;
  }

  return false;
};
