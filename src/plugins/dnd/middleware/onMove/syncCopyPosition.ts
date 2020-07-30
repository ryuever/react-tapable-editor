import { OnMoveArgs } from '../../../../types';
import { Action } from 'sabar';

export default (args: any, _: object, actions: Action) => {
  const { impactPoint, clone } = args as OnMoveArgs;
  const [clientX, clientY] = impactPoint;
  clone.style.position = 'fixed';
  clone.style.top = `${clientY}px`;
  clone.style.left = `${clientX}px`;

  actions.next();
};
