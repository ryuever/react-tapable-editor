import React, { useCallback, useRef, useEffect } from 'react';
import { Editor } from 'draft-js';
import Title from './components/title';

// `ImageToolbar`, `InlineToolbar` and `Sidebar` only has one instance.
import ImageToolbar from './components/image-toolbar';
import InlineToolbar from './components/inline-toolbar';
import Sidebar from './components/sidebar';

import compareArray from './utils/compareArray';

import './style.css';
// https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
import 'draft-js/dist/Draft.css';

import withEditor from './withEditor';

const NewEditor = props => {
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
  const didUpdate = useRef(false);
  const pasteText = useRef();
  const lastBlockMapKeys = useRef([]);
  const isInCompositionModeRef = useRef(false);

  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const currentBlockMap = currentContent.getBlockMap();
    const currentBlockMapKeys = currentBlockMap.keySeq().toArray();
    const diff = compareArray(lastBlockMapKeys.current, currentBlockMapKeys);
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
    const diff = compareArray(lastBlockMapKeys.current, currentBlockMapKeys);

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

      const newContentState = nextState.getCurrentContent();
      // const blockMap = newContentState.getBlockMap();
      const lastBlock = newContentState.getLastBlock();
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

  const handleDroppedFiles = useCallback(
    (dropSelection, files) => {
      hooks.handleDroppedFiles.call(editorState, dropSelection, files);
    },
    [editorState, hooks.handleDroppedFiles]
  );

  // const handlePastedText = (text, html, es) => {
  //   pasteText.current = text;
  // };

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
          handleDroppedFiles={handleDroppedFiles}
          ref={forwardRef}
          preserveSelectionOnBlur
          // handlePastedText={handlePastedText}
        />
      </div>

      <ImageToolbar forwardRef={imageRef} />
      <InlineToolbar forwardRef={inlineRef} />
      <Sidebar forwardRef={sidebarRef} />
    </div>
  );
};

const WrappedEditor = withEditor(NewEditor);

export default React.forwardRef((props, ref) => (
  <WrappedEditor {...props} forwardRef={ref} />
));
