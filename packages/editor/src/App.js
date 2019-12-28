import React from 'react';
import PluginEditor from './PluginEditor';

import PlaceholderPlugin from './plugins/PlaceholderPlugin';
import BlockStyleFnPlugin from './plugins/BlockStyleFnPlugin';
import CustomStyleMapPlugin from './plugins/CustomStyleMapPlugin';
import BlockRenderMapPlugin from './plugins/block-render-map-plugin';
import StyleControlPlugin from './plugins/StyleControlPlugin'

const App = () => {
  const plugins = [
    new PlaceholderPlugin(),
    new BlockStyleFnPlugin(),
    new CustomStyleMapPlugin(),
    new BlockRenderMapPlugin(),
    new StyleControlPlugin(),
  ];

  return (
    <PluginEditor
      plugins={plugins}
      placeholder="Story..."
    />
  );
};

export default App;
