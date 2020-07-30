/**
 * Clone node should be created if there is no copy when moving
 */

import { setCloneAttributes } from '../../setAttributes';
import Dragger from '../../Dragger';
import { Action } from 'sabar';
import { OnStartHandlerContext } from '../../../../types';

// https://stackoverflow.com/questions/1848445/duplicating-an-element-and-its-style-with-javascript
// cloneNode will not preserve node style. It requires to set clone element with fixed style
export default (args: any, ctx: object, actions: Action) => {
  const { dragger }: { dragger: Dragger } = args;
  const context = ctx as OnStartHandlerContext;
  const { el } = dragger;
  context.extra.clone = el.cloneNode(true) as HTMLElement;
  const rect = el.getBoundingClientRect();
  const { width, height } = rect;
  context.extra.clone.style.width = `${width}px`;
  context.extra.clone.style.height = `${height}px`;
  context.extra.clone.style.zIndex = '1';
  context.extra.clone.style.backgroundColor = 'transparent';

  setCloneAttributes(context.extra.clone);

  document.body.appendChild(context.extra.clone);

  actions.next();
};
