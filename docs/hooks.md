# hooks

## waterfallResult

类似bailResult都是会返回一个result，但是它会接受所有的参数设置，最后返回一个合集的东西

1. 使用waterfall替代，你必须得提供一个tap放到最后，来接受；这样会造成值只能够在它的callback中来获取
2. bailResult的话，缩短了链路长度这种需求只能为1