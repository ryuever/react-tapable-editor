import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import createAddOn from './createAddOn'
import {
  getNodeByOffsetKey,
  getOffsetKeyNodeChildren,
  getSelectableNodeByListenerKey,
} from './utils'

let count = 0

const getOffsetKeyFromListenerKey = listenerKey => {
  const parts = listenerKey.split('_')
  const blockKey = parts[0]
  return DraftOffsetKey.encode(blockKey, 0, 0)
}

class Subscription {
  constructor() {
    this.cleanup = {}
    this.nodes = {}
    this.selectableCleanUp = {}
  }

  addListeners(blockKeys) {
    this.removeAll()
    count++

    blockKeys.forEach(blockKey => {
      const listenerKey = `${blockKey}_${count}`
      this.add(listenerKey, blockKey)
    })
  }

  add(listenerKey, blockKey) {
    const offsetKey = DraftOffsetKey.encode(blockKey, 0, 0)

    const node = getNodeByOffsetKey(offsetKey)

    const enterHandler = e => this.mouseEnterHandler(e, listenerKey)
    const leaveHandler = e => this.mouseLeaveHandler(e, listenerKey)

    // 有时间可以增加一个throttle
    const moveHandler = e => this.mouseEnterHandler(e, listenerKey)

    node.addEventListener('mouseenter', enterHandler)
    node.addEventListener('mouseleave', leaveHandler)
    node.addEventListener('mousemove', moveHandler)

    this.cleanup[listenerKey] = () => {
      node.removeEventListener('mouseenter', enterHandler)
      node.removeEventListener('mouseleave', leaveHandler)
      node.removeEventListener('mousemove', moveHandler)
    }
  }

  remove(listenerKey) {
    // first remove listener
    if (this.cleanup[listenerKey]) {
      this.cleanup[listenerKey].call(this)
      delete this.cleanup[listenerKey]
    }

    // this.removeNode(listenerKey)
    this.removeNodeV2(listenerKey)
  }

  mouseEnterHandler = (e, listenerKey) => {
    // 一定要使用`currentTarget !!!!`要不然会出现`removeChild`失败的问题。。。
    const offsetKey = getOffsetKeyFromListenerKey(listenerKey)
    const children = getOffsetKeyNodeChildren(offsetKey)

    if (children.length) return

    const node = e.currentTarget
    const child = createAddOn(listenerKey)
    node.appendChild(child)

    const selectableNode = getSelectableNodeByListenerKey(listenerKey)

    const enterHandler = e => this.mouseEnterSelectableHandler(e, listenerKey)
    const leaveHandler = e => this.mouseLeaveSelectableHandler(e, listenerKey)
    selectableNode.addEventListener('mouseenter', enterHandler)
    selectableNode.addEventListener('mouseleave', leaveHandler)

    this.selectableCleanUp[listenerKey] = () => {
      selectableNode.removeEventListener('mouseenter', enterHandler)
      selectableNode.removeEventListener('mouseleave', leaveHandler)
    }

    // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    requestAnimationFrame(() => {
      child.classList.add('sidebar-addon-visible')
    });

    // console.log('add child', child)

    this.nodes[listenerKey] = {
      node,
      child,
    }
  }

  mouseLeaveHandler = (e, listenerKey) => {
    this.removeNodeV2(listenerKey)
  }

  removeNodeV2 = listenerKey => {
    if (this.nodes[listenerKey]) {
      const { node, child } = this.nodes[listenerKey]
      try {
        if (node.contains(child)) {
          node.removeChild(child)
          this.selectableCleanUp[listenerKey].call(this)
        }
      } catch (err) {
        console.log('err ', err)
      }
      delete this.nodes[listenerKey]
    }
  }

  mouseEnterSelectableHandler = (e, listenerKey) => {
    e.preventDefault()
    const offsetKey = getOffsetKeyFromListenerKey(listenerKey)
    const node = getNodeByOffsetKey(offsetKey)
    node.setAttribute('draggable', true)
  }

  mouseLeaveSelectableHandler = (e, listenerKey) => {
    e.preventDefault()
    const offsetKey = getOffsetKeyFromListenerKey(listenerKey)
    const node = getNodeByOffsetKey(offsetKey)
    node.removeAttribute('draggable')
  }

  removeAll() {
    // first remove listener
    const keys = Object.keys(this.cleanup)
    keys.forEach(listenerKey => this.remove(listenerKey))
  }
}

export default new Subscription()