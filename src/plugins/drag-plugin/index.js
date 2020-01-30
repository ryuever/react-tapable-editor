import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import subscription from './subscription'
import decorateDraggableSource from './decorateDraggableSource'

function DragPlugin() {
  this.apply = (getEditor) => {
    const { hooks } = getEditor()

    hooks.updateDragSubscription.tap('DragPlugin', diff => {
      diff.forEach(value => {
        const { op, blockKey } = value
        const offsetKey = DraftOffsetKey.encode(blockKey, 0, 0)
        const node = document.querySelector(`[data-offset-key="${offsetKey}"]`)
        if (!node) return
        console.log('node : ', node)

        // 增加了一个block
        if (op === 'add') {
          subscription.addTarget(blockKey, node)
          subscription.addSource(blockKey, node)
        }

        // 减少了一个block
        if (op === 'remove') {

        }
      })
    })
  }
}

export default DragPlugin