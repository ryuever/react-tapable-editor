import React from 'react'
import PluginEditor from './PluginEditor'

import PlaceholderPlugin from './plugins/PlaceholderPlugin'
import BlockStyleFnPlugin from './plugins/BlockStyleFnPlugin'
import CustomStyleMapPlugin from './plugins/CustomStyleMapPlugin'
import RemoveLastNonWidthCharacterPlugin from './plugins/RemoveLastNonWidthCharacterPlugin'
import PreserveNewLineInlineStylePlugin from './plugins/PreserveNewLineInlineStylePlugin'
import BlockRenderMapPlugin from './plugins/block-render-map-plugin'

const App = () => {
  const plugins = [
    new PlaceholderPlugin(),
    new BlockStyleFnPlugin(),
    new CustomStyleMapPlugin(),
    new BlockRenderMapPlugin(),
    new RemoveLastNonWidthCharacterPlugin(),
    new PreserveNewLineInlineStylePlugin(),
  ]

  return (
    <PluginEditor
      plugins={plugins}
      placeholder="Story..."
    />
  )
}

export default App