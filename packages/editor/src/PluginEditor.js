import React, { PureComponent, createRef } from 'react'
import {
  RichUtils,
  EditorState,
} from 'draft-js';
import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
} from 'tapable'
import Context from './Context'
const { Provider } = Context

import Editor from './Editor'

class PluginEditor extends PureComponent {
  constructor(props) {
    super(props)
    const { plugins } = props
    this.plugins = plugins || []
    this.hooks = {
      onChange: new SyncHook(['editorState']),
      toggleBlockType: new SyncHook(['blockType']),
      toggleInlineStyle: new SyncHook(['inlineStyle']),
      createBlockRenderMap: new SyncWaterfallHook(['blockRenderMap']),
      createCustomStyleMap: new SyncWaterfallHook(['customStyleMap']),
      blockStyleFn: new SyncBailHook(['block']),
      handleKeyCommand: new SyncBailHook(['command', 'editorState']),

      didUpdate: new SyncHook(),
    }

    this.editorRef = createRef()
    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.plugins.forEach(plugin =>{
      plugin.apply(this.getEditor)
    })

    this.init()
  }

  componentDidMount() {
    this.hooks.onChange.tap('onChange', editorState => {
      this.setState({ editorState })
    })
    this.hooks.toggleBlockType.tap('toggleBlockType', blockType => {
      const { editorState } = this.state
      const newEditorState = RichUtils.toggleBlockType(editorState, blockType)
      this.setState({ editorState: newEditorState })
    })
    this.hooks.toggleInlineStyle.tap('toggleInlineStyle', inlineStyle => {
      const { editorState } = this.state

      const newEditorState = RichUtils.toggleInlineStyle(editorState, inlineStyle)
      this.setState({ editorState: newEditorState })
    })
  }

  getEditor = () => {
    return {
      hooks: this.hooks,
      editorState: this.state.editorState,
      editorRef: this.editorRef,
    }
  }

  init = () => {
    // this.blockRenderMap = this.hooks.createBlockRenderMap.call()
    this.customStyleMap = this.hooks.createCustomStyleMap.call()
  }

  render() {
    const { plugins, ...rest} = this.props
    return (
      <Provider value={this.getEditor}>
        <Editor
          {...rest}
          blockRenderMap={this.blockRenderMap}
          ref={this.editorRef}
        />
      </Provider>
    )
  }
}

export default PluginEditor