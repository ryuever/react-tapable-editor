/**
 * Clone node should be created if there is no copy when moving
 */

// https://stackoverflow.com/questions/1848445/duplicating-an-element-and-its-style-with-javascript
// cloneNode will not preserve node style. It requires to set clone element with fixed style
export default ({ dragger }, ctx, actions) => {
  const { el } = dragger;
  ctx.extra.clone = el.cloneNode(true);
  const rect = el.getBoundingClientRect();
  const { width, height } = rect;
  ctx.extra.clone.style.width = width;
  ctx.extra.clone.style.height = height;
  ctx.extra.clone.style.zIndex = 1;
  ctx.extra.clone.style.backgroundColor = "transparent";

  document.body.appendChild(ctx.extra.clone);
  const styles = document.defaultView.getComputedStyle(el);

  actions.next();
};
