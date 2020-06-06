import { bindEvents } from "../../../utils/event/bindEvents";
import { findClosestDraggerFromEvent } from "../find";

class Mouse {
  constructor({ moveAPI }) {
    this.moveAPI = moveAPI;
  }

  start() {
    bindEvents(window, {
      eventName: "mousedown",
      fn: event => {
        const dragger = findClosestDraggerFromEvent(event);
        if (dragger === -1) return;

        this.onStartHandler.start({ dragger, event });
        const { clone } = this.extra;

        // If dragger exists, then start to bind relative listener
        const unbind = bindEvents(window, [
          {
            // target should be moved by mousemove event.
            eventName: "mousemove",
            fn: event => {
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
              document.body.removeChild(clone);
            }
          }
        ]);
      }
    });
  }
}

export default Mouse;
