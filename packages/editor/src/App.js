import React from 'react';
import PluginEditor from './PluginEditor';

import PlaceholderPlugin from './plugins/PlaceholderPlugin';
import BlockStyleFnPlugin from './plugins/BlockStyleFnPlugin';
import CustomStyleMapPlugin from './plugins/CustomStyleMapPlugin';
import BlockRenderMapPlugin from './plugins/block-render-map-plugin';
import StyleControlPlugin from './plugins/StyleControlPlugin'
import DefaultHandleKeyCommandPlugin from './plugins/DefaultHandleKeyCommandPlugin'
import HandleDroppedFilesPlugin from './plugins/HandleDroppedFilesPlugin'
import AddImagePlugin from './plugins/AddImagePlugin'
import AlignmentPlugin from './plugins/AlignmentPlugin'
import InlineToolbarPlugin from './plugins/InlineToolbarPlugin'

const App = () => {
  const plugins = [
    new PlaceholderPlugin(),
    new BlockStyleFnPlugin(),
    new CustomStyleMapPlugin(),
    new BlockRenderMapPlugin(),
    new StyleControlPlugin(),

    new AddImagePlugin(),
    new HandleDroppedFilesPlugin(),

    // 对于keyCommand的一个兜底行为
    new DefaultHandleKeyCommandPlugin(),

    new AlignmentPlugin(),

    new InlineToolbarPlugin(),
  ];

  return (
    <PluginEditor
      plugins={plugins}
      placeholder="Story..."
    />
  );
};

export default App;
