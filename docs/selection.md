# Selection

经过一系列操作的时候，经常会处理`selection`...

## methods

### Modifier.splitBlock

执行完以后，它的selection应该是放置到刚刚触发split时创造出的block的开头；

可以通过什么形式验证？

```js
const newState = Modifier.split(editorState, selection)
```

## how to forceSelection
