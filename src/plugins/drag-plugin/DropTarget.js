import { keyExtractor } from './keyExtractor';
import { generateOffsetKey } from '../../utils/keyHelper';
import { getNodeByOffsetKey } from '../../utils/findNode';
import { bindEvents } from '../../utils/event/bindEvents';

class DropTarget {
  constructor({ blockKey, addDropTarget, removeDropTarget }) {
    this.blockKey = blockKey;
    this.offsetKey = generateOffsetKey(this.blockKey);
    this.listenerKey = keyExtractor(blockKey, 'target');
    this.addDropTarget = addDropTarget;
    this.removeDropTarget = removeDropTarget;
    this.teardown = this.setup();
  }

  mouseEnterHandler = e => {
    e.preventDefault();
    this.addDropTarget(this.listenerKey);
  };

  mouseLeaveHandler = e => {
    e.preventDefault();
    this.removeDropTarget(this.listenerKey);
  };

  /**
   * https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
   * Could not throttle `dragOverHandler` directly. or `dropHandler` will be not
   * triggered.
   */
  dragOverHandler = e => {
    e.preventDefault();
  };

  setup() {
    const node = getNodeByOffsetKey(this.offsetKey);
    return bindEvents(
      node,
      [
        {
          eventName: 'mouseenter',
          fn: this.mouseEnterHandler,
        },
        {
          eventName: 'mouseleave',
          fn: this.mouseLeaveHandler,
        },
      ],
      {
        capture: true,
      }
    );
  }
}

export default DropTarget;
