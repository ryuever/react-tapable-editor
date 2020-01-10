# tips

## get last change type

[Is there a way to distinguish what changed in onChange callback? #830](https://github.com/facebook/draft-js/issues/830)调用方法得到[EditorChangeType](https://draftjs.org/docs/api-reference-editor-change-type)

```js
editorState.getLastChangeType()
```