import { Action } from 'sabar';
import { OnMoveHandleContext } from '../../../../types';

const addIntermediateCtxValue = (ctx: object, actions: Action) => {
  const context = ctx as OnMoveHandleContext;
  context.action = {};

  actions.next();
};

export default addIntermediateCtxValue;
