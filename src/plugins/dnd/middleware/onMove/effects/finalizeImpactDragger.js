import { orientationToAxis, axisMeasure, isFunction } from "../../../utils";

const upstreamPosition = ["top", "left"];
const downstreamPosition = ["right", "bottom"];

export default ({ dragger }, ctx, actions) => {
  const {
    impact: { operation, impactDragger, impactPosition, impactIndex },
    prevImpact: { impactIndex: prevImpactIndex }
  } = ctx;

  const impactContainer = impactDragger.container;
  const {
    containerConfig: { orientation, impactDraggerEffect, draggerEffect }
  } = impactContainer;

  const axis = orientationToAxis[orientation];
  const measures = axisMeasure[axis];

  const impaction = {};

  if (upstreamPosition.indexOf(impactPosition) !== -1) {
    impaction.placedPosition = measures[0];
  } else {
    impaction.placedPosition = measures[1];
  }

  // Move from other container or invalid position, always trigger
  // `impactDraggerEffect` if it has this function
  if (operation === "REPLACE") {
    if (upstreamPosition.indexOf(impactPosition) !== -1) {
      impaction.needMove = false;
    } else {
      impaction.needMove = true;
    }

    if (isFunction(impactDraggerEffect)) {
      impactDraggerEffect(impaction);
    }

    if (isFunction(draggerEffect)) {
      draggerEffect(impaction);
    }
  }

  if (operation === "REORDER") {
    if (prevImpactIndex < impactIndex) {
      if (downstreamPosition.indexOf(impactPosition) !== -1) {
        impaction.needMove = true;
        if (isFunction(impactDraggerEffect)) {
          impactDraggerEffect(impaction);
        }

        if (isFunction(draggerEffect)) {
          draggerEffect(impaction);
        }
      }
    }

    if (prevImpactIndex > impactIndex) {
      if (upstreamPosition.indexOf(impactPosition) !== -1) {
        impaction.needMove = true;
        if (isFunction(impactDraggerEffect)) {
          impactDraggerEffect(impaction);
        }

        if (isFunction(draggerEffect)) {
          draggerEffect(impaction);
        }
      }
    }
  }

  actions.next();
};
