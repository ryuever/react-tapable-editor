import { Point, OnMoveHandleContext } from '../../../../types';
import { Action } from 'sabar';

export default (
  {
    impactPoint,
    clone,
  }: {
    impactPoint: Point;
    clone: HTMLElement;
  },
  _: object,
  actions: Action
) => {
  const [clientX, clientY] = impactPoint;
  clone.style.position = 'fixed';
  clone.style.top = `${clientY}px`;
  clone.style.left = `${clientX}px`;

  actions.next();
};
