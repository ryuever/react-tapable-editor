import { Action } from 'sabar';
import { OnMoveHandleContext } from 'types';

const handleLeaveOtherContainer = (ctx: object, actions: Action) => {
  const context = ctx as OnMoveHandleContext;
  const {
    action: { operation, isHomeContainerFocused, effectsManager },
  } = context;
  if (operation !== 'onLeave' || isHomeContainerFocused) {
    actions.next();
    return;
  }

  effectsManager!.teardown();

  actions.next();
};

export default handleLeaveOtherContainer;
