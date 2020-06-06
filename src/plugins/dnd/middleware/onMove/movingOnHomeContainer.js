/**
 * In order to determine whether dragger is moving on its direct parent container.
 */
export default ({ dragger }, ctx, actions) => {
  const { parent } = dragger;
  const { overlappedContainer } = ctx;

  ctx.isMovingOnHomeContainer = parent.id === overlappedContainer.id;

  actions.next();
};
