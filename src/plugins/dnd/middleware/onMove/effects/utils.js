export const generateEffectKey = (
  vContainer,
  impactVDragger,
  placedPosition
) => {
  return `${vContainer.id}_${impactVDragger.id}_${placedPosition}`;
};
