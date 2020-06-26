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

## How does overlapping work

### nested dragging component

1. When moving on dragger element, only vertical dnd should be considered.
2. If under `nested` mode, moving on candidate dragger element should be locked on `vertical` orientation
3. Only `candidateDraggers` has `collisionPadding`

## Impact

### has placeholder

`draggerEffect` is used to placed candidateDragger on right position and should be required.

### not has placeholder

##

## How to work

Only if moving on home container, there is `upstreamEffect`.

1. enter home container: all the component below point index should be considered.
   1. component index greater than dragger original index, reset `upstreamEffect`
   2. component index less than dragger original index, trigger `downstreamEffect`
2. enter other container
   1. all the component below point index should trigger `downstreamEffect`
3. leave home container:
   3. withPlaceholder
      1. true:
         1. component index greater than dragger original index, reset `downstreamEffect`
         2. component index less than dragger original index, trigger `upstreamEffect`
      2. false:
         1. reset the effect of previous impact dragger
4. leave other container: reset all of its effects
5. move on home container:
   1. move up: point should be at the upper half of direct upper sibling element
      1. beneath dragger original position
         1. down element is to reset `upstreamEffect`
      2. upper dragger original position
         1. down element is to trigger `downstreamEffect`
   2. move down: point should be at the down half of direct upper sibling element
      1. beneath dragger original position
         1. up element is to trigger `upstreamEffect`
      2. upper dragger original position
         1. up element is to reset `downstreamEffect`
6. move on other container:
   1. move up: point should be at the upper half of direct upper sibling element
      1. down element is to trigger `downstreamEffect`
   2. move down: point should be at the down half of direct upper sibling element
      1. up element is to reset `downstreamEffect`

## props

### rootConfig

#### withPlaceholder: boolean

default to be true..

### containerConfig

#### placeholderRenderer: boolean

It is meaningful only if `withPlaceholder` is true and its default value is set as blank area.
