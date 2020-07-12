import closest from '../closest';
import { Config } from '../../../types';

export const hasDraggerHandlerMatched = (
  el: HTMLElement,
  configs: Config[]
) => {
  const len = configs.length;
  for (let i = 0; i < len; i++) {
    const { draggerHandlerSelector } = configs[i];
    if (closest(el, draggerHandlerSelector)) return true;
  }

  return false;
};
