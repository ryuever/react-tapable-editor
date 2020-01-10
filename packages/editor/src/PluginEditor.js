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
import decorateComposer from './decoratorComposer'

class PluginEditor extends PureComponent {
  constructor(props) {
    super(props)
    const { plugins } = props
    this.plugins = plugins || []
    this.hooks = {
      setState: new SyncHook(['editorState', 'callback']),
      onChange: new SyncWaterfallHook(['editorState']),
      toggleWaterfallBlockType: new SyncWaterfallHook([
        'newEditorState',
        'editorState',
        'blockType'
      ]),

      toggleBlockType: new SyncHook([
        'editorState',
        'blockType',
      ]),

      toggleInlineStyleV2: new SyncHook([
        'inlineStyle',
      ]),

      toggleInlineStyle: new SyncHook([
        'inlineStyle'
      ]),

      afterInlineStyleApplied: new SyncWaterfallHook([
        'newEditorState',
        'editorState',
        'inlineStyle'
      ]),

      createBlockRenderMap: new SyncBailHook(),
      createCustomStyleMap: new SyncBailHook(),
      blockStyleFn: new SyncBailHook(['block']),
      handleKeyCommand: new SyncBailHook(['command', 'editorState']),

      handleDroppedFiles: new SyncHook([
        'editorState',
        'dropSelection',
        'files'
      ]),
      addImage: new SyncHook(['editorState', 'file']),

      blockRendererFn: new SyncBailHook(['contentBlock', 'editorState']),
      createPlaceholder: new SyncHook(['editorState', 'placeholder']),

      didUpdate: new SyncHook(['editorState']),

      // 用来更新placeholder
      updatePlaceholder: new SyncHook(['editorState', 'placeholder']),

      // decorators
      compositeDecorator: new SyncWaterfallHook(['decorators']),

      keyBindingFn: new SyncBailHook(['e']),

      syncSelectionChange: new SyncHook(['editorState']),
      // 第一次打开editor时，因为prev值都是undefined这个时候可以认为是初始化时的变化
      selectionInitChange: new SyncHook(['editorState', 'payload']),
      selectionCollapsedChange: new SyncHook(['editorState', 'payload']),
      selectionFocusChange: new SyncHook(['editorState', 'payload']),
      selectionMoveInnerBlock: new SyncHook(['editorState', 'payload']),
      selectionMoveOuterBlock: new SyncHook(['editorState', 'payload']),
      selectionRangeChange: new SyncHook(['editorState', 'payload']),
    }

    this.editorRef = createRef()
    this.inlineToolbarRef = createRef()
    this.imageToolbarRef = createRef()
    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.plugins.forEach(plugin => {
      plugin.apply(this.getEditor)
    })

    decorateComposer.getEditor = this.getEditor

    this.init()
  }

  componentDidMount() {
    this.hooks.onChange.tap('onChange', editorState => {
      this.setState({ editorState })
    })

    this.hooks.setState.tap('setState', (editorState, callback) => {
      this.setState({ editorState }, () => {
        const newState = this.state.editorState
        if (typeof callback === 'function') {
          callback(newState)
        }
      })
    })

    this.hooks.toggleWaterfallBlockType.tap('toggleWaterfallBlockType', (
      newEditorState,
      editorState,
      blockType
    ) => {
      const nextEditorState = newEditorState || editorState
      console.log('block : ', blockType)
      this.setState({
        editorState: RichUtils.toggleBlockType(
          nextEditorState,
          blockType
        )
      })
    })

    this.hooks.toggleBlockType.tap('toggleBlockType', (editorState, blockType) => {
      console.log('block 2 ', blockType, editorState)
      this.setState({
        editorState: RichUtils.toggleBlockType(
          editorState,
          blockType
        )
      })
    })

    this.hooks.toggleInlineStyleV2.tap('toggleInlineStyle', inlineStyle => {
      const { editorState } = this.state
      this.setState({
        editorState: RichUtils.toggleInlineStyle(
          editorState,
          inlineStyle
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
          editorState,
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
  }

  getEditor = () => {
    return {
      hooks: this.hooks,
      editorState: this.state.editorState,
      editorRef: this.editorRef,
      inlineToolbarRef: this.inlineToolbarRef,
      imageToolbarRef: this.imageToolbarRef,
    }
  }

  init = () => {
    this.blockRenderMap = this.hooks.createBlockRenderMap.call()
    this.customStyleMap = this.hooks.createCustomStyleMap.call()
  }

  render() {
    const { plugins, ...rest} = this.props
    return (
      <Provider value={this.getEditor}>
        <Editor
          {...rest}
          customStyleMap={this.customStyleMap}
          blockRenderMap={this.blockRenderMap}
          ref={this.editorRef}
          imageRef={this.imageToolbarRef}
          inlineRef={this.inlineToolbarRef}
        />
      </Provider>
    )
  }
}

export default PluginEditor