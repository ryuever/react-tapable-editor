import React, { PureComponent, createRef } from 'react'
import {
  RichUtils,
  EditorState,
  CompositeDecorator,
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
      setState: new SyncHook(['editorState']),
      onChange: new SyncWaterfallHook(['editorState']),
      toggleBlockType: new SyncWaterfallHook([
        'newEditorState',
        'editorState',
        'blockType'
      ]),

      toggleInlineStyle: new SyncHook([
        'inlineStyle'
      ]),

      afterInlineStyleApplied: new SyncWaterfallHook([
        'newEditorState',
        'editorState',
        'inlineStyle'
      ]),

      createBlockRenderMap: new SyncWaterfallHook(['blockRenderMap']),
      createCustomStyleMap: new SyncWaterfallHook(['customStyleMap']),
      blockStyleFn: new SyncBailHook(['block']),
      handleKeyCommand: new SyncBailHook(['command', 'editorState']),

      blockRendererFn: new SyncBailHook(['contentBlock', 'editorState']),
      createPlaceholder: new SyncHook(['editorState', 'placeholder']),

      didUpdate: new SyncHook(['editorState']),

      // 用来更新placeholder
      updatePlaceholder: new SyncHook(['editorState', 'placeholder']),

      // decorators
      compositeDecorator: new SyncWaterfallHook(['decorators']),

      keyBindingFn: new SyncBailHook(['e']),
    }

    console.log('hooks : ', this.hooks)

    this.editorRef = createRef()
    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.plugins.forEach(plugin => {
      plugin.apply(this.getEditor)
    })

    this.init()
  }

  componentDidMount() {
    this.hooks.onChange.tap('onChange', editorState => {
      console.log('onchange : ', editorState)
      this.setState({ editorState })
    })

    this.hooks.setState.tap('setState', editorState => {
      this.setState({ editorState })
    })

    this.hooks.toggleBlockType.tap('toggleBlockType', (
      newEditorState,
      editorState,
      blockType
    ) => {
      const nextEditorState = newEditorState || editorState
      this.setState({
        editorState: RichUtils.toggleBlockType(
          nextEditorState,
          blockType
        )
      })
    })

    this.hooks.toggleInlineStyle.tap('toggleInlineStyle', inlineStyle => {
      const { editorState } = this.state
      this.setState({
        editorState: RichUtils.toggleInlineStyle(
          editorState,
          inlineStyle
        )
      }, () => {
        const { editorState } = this.state
        this.hooks.afterInlineStyleApplied.call(
          null,
          editorState,
          inlineStyle,
        )
      })
    })

    this.hooks.afterInlineStyleApplied.tap('afterInlineStyleApplied', (
      newEditorState,
      editorState,
    ) => {
      const nextEditorState = newEditorState || editorState
      this.setState({
        editorState: nextEditorState
      })
    })

    // this.hooks.compositeDecorator.tap('compositeDecorator', decorators => {
    //   const { editorState } = this.state
    //   const newEditorState = EditorState.set(editorState, {
    //     decorator: new CompositeDecorator(decorators),
    //   })
    //   this.setState({
    //     decorators: newEditorState
    //   })
    // })
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