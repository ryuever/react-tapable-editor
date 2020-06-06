export const orientationToAxis = {
  vertical: "y",
  horizontal: "x"
};

export const axisMeasure = {
  y: ["top", "bottom"],
  x: ["left", "right"]
};

export const axisClientMeasure = {
  x: "clientX",
  y: "clientY"
};

export const isClamped = (value, min, max) => {
  return value >= min && value <= max;
};
