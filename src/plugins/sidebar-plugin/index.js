import Subscription from "./Subscription";
import "./styles.css";

/**
 * 1. mouse enter into block (including safe area and block itself), side bar should display on
 *    current block. when mouse position do not belong to any block, side bar will be put by the
 *    side of block where selection exist.
 * 2. If side bar display, only if you begin to typing characters it will disappear.
 *    1. select text in same block will not trigger its disappear
 *    2. select text range including other block, it will make sidebar appear on other block's heading.
 *    3. click a position will not trigger its disappear
 * 3. when typing or enter into new line, sidebar should not display...
 */

// TODO 存在的问题
// 比如每一次用中文输入法输入完成以后

// 不使用`DraftBlockRenderMap`的原因，是因为比如说一直敲`enter`的话，接下来的`unstyle` block
// 不会每一个都作为一个独立`children`，而是汇集到一块；

let resetListener = true;
let timeoutHandler;

// https://stackoverflow.com/questions/15066849/how-to-detect-when-mousemove-has-stopped
// simulate `moveend` event...
const globalMouseMoveHandlerCapture = e => {
  if (timeoutHandler) clearTimeout(timeoutHandler);
  timeoutHandler = setTimeout(() => {
    resetListener = true;
  }, 300);
};

window.addEventListener("mousemove", globalMouseMoveHandlerCapture, true);

function SidebarPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    const subscription = new Subscription(getEditor);

    hooks.syncBlockKeys.tap("SidebarPlugin", (blockKeys, blockChanges) => {
      if (!resetListener && !blockChanges) return;

      subscription.addListeners(blockKeys);

      resetListener = false;
    });
  };
}

export default SidebarPlugin;
