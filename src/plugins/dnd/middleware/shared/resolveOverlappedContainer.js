import { findClosestDroppableContainerFromEvent } from "../../find";

export default ({ event }, ctx, actions) => {
  const { containers } = ctx;
  const overlappedContainer = findClosestDroppableContainerFromEvent(
    event,
    containers
  );
  ctx.overlappedContainer = overlappedContainer;
  actions.next();
};
