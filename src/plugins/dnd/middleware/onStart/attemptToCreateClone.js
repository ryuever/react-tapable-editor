/**
 * Clone node should be created if there is no copy when moving
 */

export default ({ dragger }, ctx, actions) => {
  ctx.extra.clone = dragger.cloneNode(true);
  document.body.appendChild(ctx.extra.clone);

  actions.next();
};
