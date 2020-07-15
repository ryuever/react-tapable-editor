import { Action } from 'sabar';
import { OnMoveHandleContext } from '../../../../types';

const removeIntermediateCtxValue = (ctx: object, actions: Action) => {
  const context = ctx as OnMoveHandleContext;
  delete context.action;
  actions.next();
};

export default removeIntermediateCtxValue;
