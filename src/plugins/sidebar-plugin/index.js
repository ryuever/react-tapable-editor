import subscription from './subscription'
import './styles.css'

// TODO 存在的问题
// 比如每一次用中文输入法输入完成以后

// 不使用`DraftBlockRenderMap`的原因，是因为比如说一直敲`enter`的话，接下来的`unstyle` block
// 不会每一个都作为一个独立`children`，而是汇集到一块；

let resetListener = true
let timeoutHandler
const globalMouseMoveHandlerCapture = e => {
  if (timeoutHandler) clearTimeout(timeoutHandler)
  timeoutHandler = setTimeout(() => {
    resetListener = true
  }, 300)
}

window.addEventListener('mousemove', globalMouseMoveHandlerCapture, true)

function DragPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor()

    hooks.syncBlockKeys.tap('DragPlugin', (blockKeys, blockChanges) => {
      if (!resetListener && !blockChanges) return

      subscription.addListeners(blockKeys)

      resetListener = false
    })
  }
}

export default DragPlugin