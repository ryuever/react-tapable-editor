export const orientationToAxis = {
  vertical: 'y',
  horizontal: 'x',
};

export const axisMeasure = {
  y: ['top', 'bottom'],
  x: ['left', 'right'],
};

export const orientationToMeasure = orientation => {
  const axis = orientationToAxis[orientation];
  return axisMeasure[axis];
};

export const axisClientMeasure = {
  x: 'clientX',
  y: 'clientY',
};

export const isClamped = (value, min, max) => {
  return value >= min && value <= max;
};

export const isFunction = fn => typeof fn === 'function';
