import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

import createAddOn from './createAddOn'

let count = 0

const getNodeByOffsetKey = offsetKey => {
  return document.querySelector(`[data-block="true"][data-offset-key="${offsetKey}"]`)
}

const getOffsetKeyNodeChildren = offsetKey => {
  return document.querySelectorAll(`[data-block="true"][data-offset-key="${offsetKey}"] div.sidebar-addon`)
}

class Subscription {
  constructor() {
    this.cleanup = {}
    this.blockNodeMap = {}
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

    console.log('add ', listenerKey, node)
    const enterHandler = e => this.mouseEnterHandler(e, listenerKey, offsetKey)
    const leaveHandler = e => this.mouseLeaveHandler(e, listenerKey, offsetKey)
    const moveHandler = e => this.mouseEnterHandler(e, listenerKey, offsetKey)

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

    // remove node
    if (this.blockNodeMap[listenerKey]) {
      const { offsetKey } = this.blockNodeMap[listenerKey]
      const target = getNodeByOffsetKey(offsetKey)
      const children = getOffsetKeyNodeChildren(offsetKey)
      children.forEach(child => target.removeChild(child))

      delete this.blockNodeMap[listenerKey]
    }
  }

  mouseEnterHandler = (e, listenerKey, offsetKey) => {
    if (this.blockNodeMap[listenerKey]) return

    // 一定要使用`currentTarget !!!!`要不然会出现`removeChild`失败的问题。。。
    const node = e.currentTarget
    const child = createAddOn(listenerKey)
    node.appendChild(child)

    // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    requestAnimationFrame(() => {
      child.classList.add('sidebar-addon-visible')
    });

    node.setAttribute('draggable', true)

    this.blockNodeMap[listenerKey] = {
      offsetKey: offsetKey,
      child: child,
    }
  }

  mouseLeaveHandler = (e, listenerKey, offsetKey) => {
    if (this.blockNodeMap[listenerKey]) {
      const target = getNodeByOffsetKey(offsetKey)
      const children = getOffsetKeyNodeChildren(offsetKey)

      children.forEach(child => target.removeChild(child))
    }
  }

  removeAll() {
    // first remove listener
    const keys = Object.keys(this.cleanup)
    keys.forEach(listenerKey => this.remove(listenerKey))
  }
}

export default new Subscription()