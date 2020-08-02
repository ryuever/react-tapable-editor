import Container from '../../../Container';
import Dragger from '../../../Dragger';
import { Position } from '../../../../../types';

export const generateDraggerEffectKey = (
  vContainer: Container,
  impactVDragger: Dragger,
  placedPosition: Position
) => {
  return `${vContainer.id}_${impactVDragger.id}_${placedPosition}`;
};

export const generateContainerEffectKey = (
  vContainer: Container,
  status: string
) => {
  return `${vContainer.id}_${status}`;
};
