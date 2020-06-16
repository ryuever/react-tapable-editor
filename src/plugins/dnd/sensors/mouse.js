import { bindEvents } from "../../../utils/event/bindEvents";
import { findClosestDraggerElementFromEvent } from "../find";
import { hasDraggerHandlerMatched } from "./utils";

class Mouse {
  constructor({
    moveAPI,
    getClone,
    onStartHandler,
    onMoveHandler,
    getDragger,
    getContainer,
    configs
  }) {
    this.moveAPI = moveAPI;
    this.getClone = getClone;
    this.getDragger = getDragger;
    this.getContainer = getContainer;
    this.onStartHandler = onStartHandler;
    this.onMoveHandler = onMoveHandler;
    this.configs = configs;
  }

  start() {
    bindEvents(window, {
      eventName: "mousedown",
      fn: event => {
        const el = findClosestDraggerElementFromEvent(event);
        if (el === -1) return;
        const target = event.target;
        if (!hasDraggerHandlerMatched(target, this.configs)) return;
        // https://stackoverflow.com/a/19164149/2006805 In order to prevent text
        // selection when moving cursor
        event.preventDefault();
        const draggerId = el.getAttribute("data-dragger-id");
        const dragger = this.getDragger(draggerId);
        this.onStartHandler.start({ dragger, event });
        const clone = this.getClone();

        // If dragger exists, then start to bind relative listener
        const unbind = bindEvents(window, [
          {
            // target should be moved by mousemove event.
            eventName: "mousemove",
            fn: event => {
              event.preventDefault();
              event.stopPropagation();
              this.onMoveHandler.start({
                event,
                dragger,
                clone,
                ...this.moveAPI()
              });
            }
          },
          {
            eventName: "mouseup",
            fn: e => {
              unbind();
              const { hooks } = this.moveAPI();
              hooks.cleanupEffects.call();
              document.body.removeChild(clone);
            }
          }
        ]);
      }
    });
  }
}

export default Mouse;
