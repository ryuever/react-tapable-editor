import React, { PureComponent, createRef, RefObject } from 'react';
import { SyncHook, SyncBailHook, SyncWaterfallHook } from 'tapable';
import {
  RichUtils,
  EditorState,
  CompositeDecorator,
  DraftBlockRenderMap,
  DraftStyleMap,
  Editor as EditorType,
} from 'draft-js';
import Context from './Context';
import { Hooks, PluginEditorState, PluginEditorProps } from './types';

import BlockStyleFnPlugin from './plugins/BlockStyleFnPlugin';
import SelectionChangePlugin from './plugins/SelectionChangePlugin';
import CustomStyleMapPlugin from './plugins/CustomStyleMapPlugin';
import BlockRenderMapPlugin from './plugins/block-render-map-plugin';
// import StyleControlPlugin from "./plugins/StyleControlPlugin";
// import HandleDroppedFilesPlugin from "./plugins/HandleDroppedFilesPlugin";
import AddImagePlugin from './plugins/AddImagePlugin';
import DefaultHandleKeyCommandPlugin from './plugins/DefaultHandleKeyCommandPlugin';

import InlineToolbarPlugin from './plugins/InlineToolbarPlugin';
import LinkSpanDecoratorPlugin from './plugins/LinkSpanDecoratorPlugin';
import LinkDecoratorPlugin from './plugins/LinkDecorator';
// import SidebarPlugin from './plugins/sidebar-plugin';

import StateFilterPlugin from './plugins/StateFilterPlugin';
// import DragPlugin from "./plugins/drag-plugin";

// import DNDPlugin from "./plugins/dnd-plugin/configNest";

// import "./decorators/prism/theme/prism.css";
import './decorators/prism/theme/editor.css';
import PrismDecorator from './decorators/prism';
import MultiDecorator from './decorators/prism/multiple';

import Editor from './Editor';
// import decorateComposer from "./decoratorComposer";
const { Provider } = Context;

const defaultPlugins = [
  // @ts-ignore
  new BlockStyleFnPlugin(),
  // @ts-ignore
  new SelectionChangePlugin(),
  // @ts-ignore
  new CustomStyleMapPlugin(),
  // @ts-ignore
  new BlockRenderMapPlugin(),

  // @ts-ignore
  new AddImagePlugin(),
  // new HandleDroppedFilesPlugin(),

  // 对于keyCommand的一个兜底行为
  // @ts-ignore
  new DefaultHandleKeyCommandPlugin(),

  // @ts-ignore
  new InlineToolbarPlugin(),
  // @ts-ignore
  new LinkSpanDecoratorPlugin(),
  // @ts-ignore
  new LinkDecoratorPlugin(),
  // @ts-ignore
  // new SidebarPlugin(),

  new StateFilterPlugin(),

  // new DNDPlugin(),
];

// https://fettblog.eu/typescript-react/components/: TypeScript and React: Components
class PluginEditor extends PureComponent<PluginEditorProps, PluginEditorState> {
  private plugins: any[];

  private hooks: Hooks;

  private editorRef: RefObject<EditorType>;

  private inlineToolbarRef: RefObject<HTMLDivElement>;

  private imageToolbarRef: RefObject<HTMLDivElement>;

  private sidebarRef: RefObject<HTMLDivElement>;

  private blockRenderMap: DraftBlockRenderMap | null;

  private customStyleMap: DraftStyleMap | null;

  constructor(props: PluginEditorProps) {
    super(props);
    const { plugins = [] } = props;
    this.plugins = plugins.concat(defaultPlugins);
    this.customStyleMap = null;
    this.blockRenderMap = null;

    this.hooks = {
      setState: new SyncHook(['editorState', 'callback']),
      onChange: new SyncWaterfallHook(['editorState']),

      stateFilter: new SyncBailHook([
        'oldEditorState',
        'editorState',
        'pasteText',
      ]),

      toggleWaterfallBlockType: new SyncWaterfallHook([
        'newEditorState',
        'editorState',
        'blockType',
      ]),

      toggleBlockType: new SyncHook(['editorState', 'blockType']),

      toggleInlineStyleV2: new SyncHook(['inlineStyle']),

      toggleInlineStyle: new SyncHook(['inlineStyle']),

      afterInlineStyleApplied: new SyncWaterfallHook([
        'newEditorState',
        'editorState',
        'inlineStyle',
      ]),

      createBlockRenderMap: new SyncBailHook(),
      createCustomStyleMap: new SyncBailHook(),
      blockStyleFn: new SyncBailHook(['block']),
      handleKeyCommand: new SyncBailHook(['command', 'editorState']),

      handleDroppedFiles: new SyncHook([
        'editorState',
        'dropSelection',
        'files',
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

      updateDecorator: new SyncWaterfallHook([
        'pairs',
        'editorState',
        'context',
      ]),

      updateDragSubscription: new SyncHook(['diff']),
      syncBlockKeys: new SyncHook(['blockKeys', 'blockChanges']),

      // for drag
      prepareDragStart: new SyncHook(['sourceBlockKey']),
      teardownDragDrop: new SyncHook(),
      afterMounted: new SyncHook(),
    };
    this.editorRef = createRef<EditorType>();
    this.inlineToolbarRef = createRef<HTMLDivElement>();
    this.imageToolbarRef = createRef<HTMLDivElement>();
    this.sidebarRef = createRef<HTMLDivElement>();

    // const rawState = dndHelperData;
    // const newContentState = convertFromRaw(rawState);

    this.state = {
      editorState: EditorState.createEmpty(),
      // editorState: EditorState.createWithContent(newContentState)
    };

    /**
     * Call instance's apply method to initial plugins.
     */
    this.plugins.forEach(plugin => {
      plugin.apply(this.getEditor);
    });

    // decorateComposer.getEditor = this.getEditor;

    this.init();
  }

  componentDidMount() {
    this.hooks.afterMounted.call();

    this.hooks.onChange.tap('onChange', (editorState: EditorState) => {
      console.log('state ', editorState);
      this.setState({ editorState });
    });

    this.hooks.setState.tap(
      'setState',
      (editorState: EditorState, callback: Function) => {
        this.setState({ editorState }, () => {
          const newState = this.state.editorState;
          if (typeof callback === 'function') {
            callback(newState);
          }
        });
      }
    );

    this.hooks.updateDecorator.tap(
      'updateDecorate',
      (pairs: [], editorState: EditorState) => {
        if (pairs.length > 0) {
          const newDecorator = new CompositeDecorator(pairs);
          this.setState({
            editorState: EditorState.set(editorState, {
              // @ts-ignore
              decorator: new MultiDecorator([
                // @ts-ignore
                new PrismDecorator(),
                newDecorator,
              ]),
            }),
          });
        }
      }
    );

    this.hooks.toggleWaterfallBlockType.tap(
      'toggleWaterfallBlockType',
      (newEditorState, editorState, blockType) => {
        const nextEditorState = newEditorState || editorState;
        this.setState({
          editorState: RichUtils.toggleBlockType(nextEditorState, blockType),
        });
      }
    );

    this.hooks.toggleBlockType.tap(
      'toggleBlockType',
      (editorState, blockType) => {
        this.setState({
          editorState: RichUtils.toggleBlockType(editorState, blockType),
        });
      }
    );

    this.hooks.toggleInlineStyleV2.tap('toggleInlineStyle', inlineStyle => {
      const { editorState } = this.state;
      this.setState({
        editorState: RichUtils.toggleInlineStyle(editorState, inlineStyle),
      });
    });

    this.hooks.toggleInlineStyle.tap('toggleInlineStyle', inlineStyle => {
      const { editorState } = this.state;
      this.setState(
        {
          editorState: RichUtils.toggleInlineStyle(editorState, inlineStyle),
        },
        () => {
          const { editorState } = this.state;
          this.hooks.afterInlineStyleApplied.call(
            editorState,
            editorState,
            inlineStyle
          );
        }
      );
    });

    this.hooks.afterInlineStyleApplied.tap(
      'afterInlineStyleApplied',
      (newEditorState, editorState) => {
        const nextEditorState = newEditorState || editorState;
        this.setState({
          editorState: nextEditorState,
        });
      }
    );

    // 需要在下一个Event loop中触发setState才能够将`decorator`生效
    setTimeout(() => {
      const { editorState } = this.state;
      this.hooks.updateDecorator.call([], editorState);
    }, 0);
  }

  getEditor = () => {
    return {
      hooks: this.hooks,
      editorState: this.state.editorState,
      editorRef: this.editorRef,
      inlineToolbarRef: this.inlineToolbarRef,
      imageToolbarRef: this.imageToolbarRef,
      sidebarRef: this.sidebarRef,
    };
  };

  init = () => {
    this.blockRenderMap = this.hooks.createBlockRenderMap.call();
    this.customStyleMap = this.hooks.createCustomStyleMap.call();
  };

  render() {
    const { plugins, ...rest } = this.props;
    return (
      <Provider value={this.getEditor}>
        <Editor
          {...rest}
          ref={this.editorRef}
          imageRef={this.imageToolbarRef}
          inlineRef={this.inlineToolbarRef}
          sidebarRef={this.sidebarRef}
          customStyleMap={this.customStyleMap!}
          blockRenderMap={this.blockRenderMap!}
          placeholder=""
        />
      </Provider>
    );
  }
}

export default PluginEditor;
