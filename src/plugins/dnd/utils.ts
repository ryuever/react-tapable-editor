import { AxisMeasure, OrientationToAxis, Orientation } from '../../types';

export const orientationToAxis: OrientationToAxis = {
  vertical: 'y',
  horizontal: 'x',
};

export const axisMeasure: AxisMeasure = {
  y: ['top', 'bottom'],
  x: ['left', 'right'],
};

export const orientationToMeasure = (orientation: Orientation): string[] => {
  const axis = orientationToAxis[orientation];
  return axisMeasure[axis];
};

export const axisClientMeasure = {
  x: 'clientX',
  y: 'clientY',
};

export const isClamped = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
};

export const isFunction = (fn: any) => typeof fn === 'function';
