import React, {
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  Editor,
  EditorState,
} from 'draft-js';
import Title from './components/title';
import ImageToolbar from './components/image-toolbar'
import InlineToolbar from './components/inline-toolbar'

import './style.css';
// https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
import 'draft-js/dist/Draft.css';

import { withEditor } from './index';

const NewEditor = (props) => {
  const {
    getEditor,
    forwardRef,
    placeholder,
    imageRef,
    inlineRef,
    blockRenderMap,
    customStyleMap,
  } = props;
  const { hooks, editorState } = getEditor();
  const didUpdate = useRef(false);
  const pasteText = useRef();

  useEffect(() => {
    if (didUpdate.current) {
      hooks.didUpdate.call(editorState);
      hooks.updatePlaceholder.call(editorState, placeholder);
      hooks.syncSelectionChange.call(editorState)
    }
  });

  useEffect(() => {
    hooks.updatePlaceholder.call(editorState, placeholder);
    didUpdate.current = true;
  }, []);

  const onChange = useCallback((newEditorState) => {
    const { editorState } = getEditor();


    const nextState = hooks.stateFilter.call(editorState, newEditorState, pasteText.current)
    console.log('change ', nextState, nextState.getLastChangeType())
    hooks.onChange.call(nextState);
  }, []);

  const handleKeyCommand = useCallback((command, es) => (
    hooks.handleKeyCommand.call(command, es)
  ), []);

  const getBlockStyle = useCallback((block) => hooks.blockStyleFn.call(block));

  const handleBlockRender = useCallback((contentBlock) => {
    const { editorState } = getEditor()
    return hooks.blockRendererFn.call(contentBlock, editorState)
  });

  const handleDroppedFiles = useCallback((dropSelection, files) => {
    hooks.handleDroppedFiles.call(editorState, dropSelection, files)
  }, [editorState])

  // const onBlurHandler = useCallback(e => {
  //   requestAnimationFrame(() => {
  //     const { editorState } = getEditor()
  //     const next = EditorState.forceSelection(
  //       editorState,
  //       editorState.getSelection().merge({ hasFocus: true })
  //     )

  //     // hooks.onChange.call(next)
  //   })
  // }, [editorState])

  const editOnPasteHandler = (editor, e) => {
    const data = new DataTransfer(e.clipboardData)
    console.log('data ', data, data.isRichText())
  }

  const handlePastedText = (text, html, es) => {
    pasteText.current = text
  }

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
          handlePastedText={handlePastedText}
          // onBlur={onBlurHandler}
        />
      </div>

      <ImageToolbar forwardRef={imageRef} />
      <InlineToolbar forwardRef={inlineRef} />
    </div>
  );
};

const WrappedEditor = withEditor(NewEditor);

export default React.forwardRef((props, ref) => (
  <WrappedEditor {...props} forwardRef={ref} />
));
