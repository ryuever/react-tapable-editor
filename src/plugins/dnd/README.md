# DND

## findDraggerFromPosition

#### smooth-dnd

##### elementFromPoint

[elementFromPoint](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint)

#### react-beautiful-dnd

- `use-mouse-sensor.js` -> `findClosestDraggableId`
- `get-drag-impact/index.js` => `getDroppableOver` 获取当前应该放置到的 container.

```js
// get-drag-impact/index.js

// `getDroppableOver` 获取当前应该放置到的container；需要注意的是在进行计算的时候，它
// 分下面的情况情况进行处理
// 1. getHasOverlap // rect是否互相覆盖
// 2. isPositionInFrame // center是否在container中
// 3. inContained // 完全包含
// 4. getFurthestAway // 获取一堆符合条件的，然后从中选择最近的

// `getDraggablesInsideDroppable` 获取当前放置到的container中的所有dragger对象
```
