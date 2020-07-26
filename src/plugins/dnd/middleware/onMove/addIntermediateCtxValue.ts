import { Action } from 'sabar';
import { OnMoveHandleContext, OnMoveOperation } from '../../../../types';

const addIntermediateCtxValue = (ctx: object, actions: Action) => {
  const context = ctx as OnMoveHandleContext;
  context.action = {
    operation: OnMoveOperation.OnStart,
    isHomeContainerFocused: false,
    effectsManager: null,
  };

  actions.next();
};

export default addIntermediateCtxValue;
