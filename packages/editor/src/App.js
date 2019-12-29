import React from 'react';
import PluginEditor from './PluginEditor';

import PlaceholderPlugin from './plugins/PlaceholderPlugin';
import BlockStyleFnPlugin from './plugins/BlockStyleFnPlugin';
import CustomStyleMapPlugin from './plugins/CustomStyleMapPlugin';
import BlockRenderMapPlugin from './plugins/block-render-map-plugin';
import StyleControlPlugin from './plugins/StyleControlPlugin'
import DefaultHandleKeyCommandPlugin from './plugins/DefaultHandleKeyCommandPlugin'

const App = () => {
  const plugins = [
    new PlaceholderPlugin(),
    new BlockStyleFnPlugin(),
    new CustomStyleMapPlugin(),
    new BlockRenderMapPlugin(),
    new StyleControlPlugin(),

    // 对于keyCommand的一个兜底行为
    new DefaultHandleKeyCommandPlugin(),
  ];

  return (
    <PluginEditor
      plugins={plugins}
      placeholder="Story..."
    />
  );
};

export default App;
