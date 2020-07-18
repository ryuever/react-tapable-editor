import React, { useCallback, useRef, useEffect, FC } from 'react';
import { Editor } from 'draft-js';
import Title from './components/title';

// `ImageToolbar`, `InlineToolbar` and `Sidebar` only has one instance.
import ImageToolbar from './components/image-toolbar';
import InlineToolbar from './components/inline-toolbar';
import Sidebar from './components/sidebar';

import compareArray from './utils/compareArray';

// import './style.css';
// // https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
// import 'draft-js/dist/Draft.css';

import withEditor from './withEditor';

import { EditorProps, EditorPropsBefore } from './types';

const NewEditor: FC<EditorProps> = props => {
  const {
    getEditor,
    forwardRef,
    placeholder,
    imageRef,
    inlineRef,
    sidebarRef,
    blockRenderMap,
    customStyleMap,
  } = props;
  const { hooks, editorState } = getEditor();
  const didUpdate = useRef<boolean>(false);
  const pasteText = useRef();
  // ts-hint: useRef([]) as RefObject<string[]> is not right. please refer to
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
  const lastBlockMapKeys = useRef<string[]>([]);
  const isInCompositionModeRef = useRef<boolean>(false);

  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const currentBlockMap = currentContent.getBlockMap();
    const currentBlockMapKeys = currentBlockMap.keySeq().toArray();
    const diff = compareArray(lastBlockMapKeys.current!, currentBlockMapKeys);
    const isInCompositionMode = editorState.isInCompositionMode();

    const force =
      diff.length || (isInCompositionModeRef.current && !isInCompositionMode);

    hooks.syncBlockKeys.call(currentBlockMapKeys, force);
    isInCompositionModeRef.current = editorState.isInCompositionMode();
  });

  useEffect(() => {
    if (didUpdate.current) {
      hooks.didUpdate.call(editorState);
      hooks.updatePlaceholder.call(editorState, placeholder);
      hooks.syncSelectionChange.call(editorState);
    }
  });

  useEffect(() => {
    hooks.updatePlaceholder.call(editorState, placeholder);
    didUpdate.current = true;
  }, [editorState, hooks.updatePlaceholder, placeholder]);

  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const currentBlockMap = currentContent.getBlockMap();
    const currentBlockMapKeys = currentBlockMap.keySeq().toArray();
    const diff = compareArray(lastBlockMapKeys.current!, currentBlockMapKeys);

    if (diff.length) {
      hooks.updateDragSubscription.call(diff);
    }

    lastBlockMapKeys.current = currentBlockMapKeys;
  });

  const onChange = useCallback(
    newEditorState => {
      const { editorState } = getEditor();

      const nextState = hooks.stateFilter.call(
        editorState,
        newEditorState,
        pasteText.current
      );

      // const newContentState = nextState.getCurrentContent();
      // const blockMap = newContentState.getBlockMap();
      // const lastBlock = newContentState.getLastBlock();
      // const lastBlockText = lastBlock.getText();

      // should invoke `DraftTreeInvariants`来验证是否是`validTree`然后才能够存储
      // console.log('on change hooks', convertToRaw(newContentState))
      // const rawState = convertToRaw(newContentState)

      hooks.onChange.call(nextState);
    },
    [getEditor, hooks.onChange, hooks.stateFilter]
  );

  const handleKeyCommand = useCallback(
    (command, es) => hooks.handleKeyCommand.call(command, es),
    [hooks.handleKeyCommand]
  );

  const getBlockStyle = useCallback(block => hooks.blockStyleFn.call(block), [
    hooks.blockStyleFn,
  ]);

  const handleBlockRender = useCallback(
    contentBlock => {
      const { editorState } = getEditor();
      return hooks.blockRendererFn.call(contentBlock, editorState);
    },
    [getEditor, hooks.blockRendererFn]
  );

  // const handleDroppedFiles = useCallback(
  //   (dropSelection, files) => {
  //     hooks.handleDroppedFiles.call(editorState, dropSelection, files);
  //   },
  //   [editorState, hooks.handleDroppedFiles]
  // );

  return (
    <div className="miuffy-editor-root">
      <div className="miuffy-editor">
        <Title />
        <Editor
          editorState={editorState}
          blockStyleFn={getBlockStyle}
          customStyleMap={customStyleMap}
          blockRenderMap={blockRenderMap}
          blockRendererFn={handleBlockRender}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          // handleDroppedFiles={handleDroppedFiles}
          ref={forwardRef}
        />
      </div>

      <ImageToolbar forwardRef={imageRef} />
      <InlineToolbar forwardRef={inlineRef} />
      <Sidebar forwardRef={sidebarRef} />
    </div>
  );
};

const WrappedEditor = withEditor(NewEditor);

// ts-hint: https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
// ts-hint: https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
export default React.forwardRef<Editor, EditorPropsBefore>((props, ref) => (
  <WrappedEditor {...props} forwardRef={ref} />
));
