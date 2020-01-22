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
import PlaceholderPlugin from './plugins/PlaceholderPlugin';
import BlockStyleFnPlugin from './plugins/BlockStyleFnPlugin';
import SelectionChangePlugin from './plugins/SelectionChangePlugin'
import CustomStyleMapPlugin from './plugins/CustomStyleMapPlugin';
import BlockRenderMapPlugin from './plugins/block-render-map-plugin';
import StyleControlPlugin from './plugins/StyleControlPlugin'
import DefaultHandleKeyCommandPlugin from './plugins/DefaultHandleKeyCommandPlugin'
import HandleDroppedFilesPlugin from './plugins/HandleDroppedFilesPlugin'
import AddImagePlugin from './plugins/AddImagePlugin'
import AlignmentPlugin from './plugins/AlignmentPlugin'
import InlineToolbarPlugin from './plugins/InlineToolbarPlugin'
import StateFilterPlugin from './plugins/StateFilterPlugin';

import LinkSpanDecoratorPlugin from './plugins/LinkSpanDecoratorPlugin'
import LinkDecoratorPlugin from './plugins/LinkDecorator'

import PrismDecorator from './decorators/prism'
// import './decorators/prism/theme/prism-solarizedlight.css'
import './decorators/prism/theme/prism.css'
import './decorators/prism/theme/editor.css'
import MultiDecorator from './decorators/prism/multiple'

const { Provider } = Context

import Editor from './Editor'
import decorateComposer from './decoratorComposer'

const defaultPlugins = [
  // new PlaceholderPlugin(),
  new BlockStyleFnPlugin(),
  new SelectionChangePlugin(),
  new CustomStyleMapPlugin(),
  new BlockRenderMapPlugin(),
  // new StyleControlPlugin(),

  new AddImagePlugin(),
  new HandleDroppedFilesPlugin(),

  // 对于keyCommand的一个兜底行为
  new DefaultHandleKeyCommandPlugin(),

  new AlignmentPlugin(),

  // new InlineToolbarPlugin(),

  new LinkSpanDecoratorPlugin(),
  new LinkDecoratorPlugin(),

  new StateFilterPlugin(),
]

class PluginEditor extends PureComponent {
  constructor(props) {
    super(props)
    const { plugins = [] } = props
    this.plugins = plugins.concat(defaultPlugins)
    this.hooks = {
      setState: new SyncHook(['editorState', 'callback']),
      onChange: new SyncWaterfallHook(['editorState']),

      stateFilter: new SyncBailHook(['oldEditorState', 'editorState', 'pasteText']),

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
      selectionRangeSizeChange: new SyncHook(['editorState', 'payload']),
      selectionRangeContentChange: new SyncHook(['editorState', 'payload']),

      inlineBarChange: new SyncHook(['editorState', 'visibility']),
      hideInlineToolbar: new SyncHook(),
      afterClickLinkButton: new SyncHook(['editorState']),
      cleanUpLinkClickState: new SyncHook(),

      toggleImageToolbarVisible: new SyncHook(['visibility', 'contentBlock']),

      updateDecorator: new SyncWaterfallHook(['pairs', 'editorState', 'context'])
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
      // console.log('trigger setState ------', editorState)

      const newContentState = editorState.getCurrentContent()
      const blockMap = newContentState.getBlockMap()
      const lastBlock = newContentState.getLastBlock()
      const lastBlockText = lastBlock.getText()

      console.log('on tap setState : ', lastBlockText)

      this.setState({ editorState }, () => {
        const newState = this.state.editorState
        if (typeof callback === 'function') {
          callback(newState)
        }
      })
    })

    this.hooks.setState.intercept({
      call: (source, target, routeList) => {
        // console.log('---------source : ', source, target)
      }
    })

    this.hooks.updateDecorator.tap('updateDecorate', (pairs, editorState, context) => {
      if (pairs.length > 0) {
        const newDecorator = new CompositeDecorator(pairs)
        this.setState({
          editorState: EditorState.set(editorState, { decorator:
            new MultiDecorator([
              new PrismDecorator(),
              newDecorator,

            ])
          }),
        })
      }
    })

    this.hooks.toggleWaterfallBlockType.tap('toggleWaterfallBlockType', (
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

    this.hooks.toggleBlockType.tap('toggleBlockType', (editorState, blockType) => {
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

    // 需要在下一个Event loop中触发setState才能够将`decorator`生效
    setTimeout(() => {
      const { editorState } = this.state
      this.hooks.updateDecorator.call([], editorState)
    }, 0)
  }

  getEditor = () => {
    // console.log('+++++++++++++ state ---------', this.state.editorState)

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