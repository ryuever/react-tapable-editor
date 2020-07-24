import { EditorRef } from '../../types';
// https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditor.react.js#L332
// https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-inline-toolbar-plugin/src/components/Toolbar/index.js#L67

const getRootNode = (editorRef: EditorRef) => {
  if (!editorRef) return;

  let rootNode = (editorRef.current as any).editor;

  while (rootNode && rootNode.className.indexOf('DraftEditor-root') === -1) {
    rootNode = rootNode.parentNode as any;
  }

  return rootNode;
};

export default getRootNode;
