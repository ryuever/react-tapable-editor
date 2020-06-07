/**
 * Clone node should be created if there is no copy when moving
 */

export default ({ dragger }, ctx, actions) => {
  const { el } = dragger;
  ctx.extra.clone = el.cloneNode(true);
  document.body.appendChild(ctx.extra.clone);

  actions.next();
};
