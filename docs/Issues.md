# Issues

## onSelect && onFocus

之所以会出现这个问题是在进行`focus` decorator开发时，如果说当前已经处于`blur`状态的话，这个时候，如果用户鼠标点击文中的位置；如果说，此次的点击和bur时的selection一致的话，它只会触发`onFocus`；但是如果说不一致，它首先触发`onFocus`然后再触发`onSelect`将光标移动到它应该在的位置