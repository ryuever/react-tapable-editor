/**
 * In order to determine whether dragger is moving on its direct parent container.
 */
export default ({ dragger }, ctx, actions) => {
  const { container } = dragger;
  const { targetContainer } = ctx;

  if (!targetContainer) {
    actions.next();
    return;
  }

  ctx.isMovingOnHomeContainer = container.id === targetContainer.id;

  actions.next();
};
