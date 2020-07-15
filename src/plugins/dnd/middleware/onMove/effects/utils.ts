import Container from '../../../Container';
import Dragger from '../../../Dragger';
import { Position } from '../../../../../types';

export const generateEffectKey = (
  vContainer: Container,
  impactVDragger: Dragger,
  placedPosition: Position
) => {
  return `${vContainer.id}_${impactVDragger.id}_${placedPosition}`;
};
