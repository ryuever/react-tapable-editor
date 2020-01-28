# Issues

## onSelect && onFocus

之所以会出现这个问题是在进行`focus` decorator开发时，如果说当前已经处于`blur`状态的话，这个时候，如果用户鼠标点击文中的位置；如果说，此次的点击和bur时的selection一致的话，它只会触发`onFocus`；但是如果说不一致，它首先触发`onFocus`然后再触发`onSelect`将光标移动到它应该在的位置

## copy and paste

[Clicking on styling button steals focus from editor, sometimes doesn't apply style to document #696](https://github.com/facebook/draft-js/issues/696)

[Copy/paste between editors #787](https://github.com/facebook/draft-js/issues/787)

[editor.props.stripPastedStyles](https://github.com/facebook/draft-js/blob/4c4465f6c05b6dbb9eb769f98e659f917bbdc0f6/src/component/handlers/edit/editOnPaste.js#L111)

## filter

[Rethinking rich text pipelines with Draft.js](https://wagtail.io/blog/rethinking-rich-text-pipelines-with-draft-js/)

[draftjs-filters](https://github.com/thibaudcolas/draftjs-filters)

[Why Wagtail’s new editor is built with Draft.js](https://wagtail.io/blog/why-wagtail-new-editor-is-built-with-draft-js/)

[draftail](https://github.com/springload/draftail)

## create block

DraftEditorContent-core.react.js


### createNestBlockPlugin
用来创建blockKey
generateRandomKey

在AtomicBlockUtils有使用到。。。
参考：splitBlockInContentState；正常触发`split-block`时，它会调用`splitBlockInContentState`这个方法；
insertTextInContentState

### DraftOffsetKey

其中会引入`blockKey`