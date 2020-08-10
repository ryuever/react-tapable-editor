import BlockStyleFnPlugin from '../plugins/BlockStyleFnPlugin';
import SelectionChangePlugin from '../plugins/SelectionChangePlugin';
import CustomStyleMapPlugin from '../plugins/CustomStyleMapPlugin';
import BlockRenderMapPlugin from '../plugins/block-render-map-plugin';
import HandleDroppedFilesPlugin from '../plugins/HandleDroppedFilesPlugin';
import AddImagePlugin from '../plugins/AddImagePlugin';
import DefaultHandleKeyCommandPlugin from '../plugins/DefaultHandleKeyCommandPlugin';

import InlineToolbarPlugin from '../plugins/InlineToolbarPlugin';
import LinkSpanDecoratorPlugin from '../plugins/LinkSpanDecoratorPlugin';
import LinkDecoratorPlugin from '../plugins/LinkDecorator';
import SidebarPlugin from '../plugins/sidebar-plugin';

import StateFilterPlugin from '../plugins/StateFilterPlugin';

import DNDPlugin from '../plugins/dnd-plugin/configNest';

import FinalNewLinePlugin from '../plugins/FinalNewLinePlugin';

import UpdateBlockDepthData from '../plugins/UpdateBlockDepthData';

import createEditor from '../createEditor';

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
  new HandleDroppedFilesPlugin(),
  // @ts-ignore
  new AddImagePlugin(),

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
  new SidebarPlugin(),

  // @ts-ignore
  new StateFilterPlugin(),

  // @ts-ignore
  new DNDPlugin(),

  // @ts-ignore
  new FinalNewLinePlugin(),

  // @ts-ignore
  new UpdateBlockDepthData(),
];

const ModernEditor = createEditor(defaultPlugins);

export default ModernEditor;
