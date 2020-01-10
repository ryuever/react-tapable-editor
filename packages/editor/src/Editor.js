import React, {
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  Editor,
} from 'draft-js';
import StyleControls from './components/style-controls';
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
  } = props;
  const { hooks, editorState } = getEditor();
  const didUpdate = useRef(false);

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

  const onChange = useCallback((es) => {
    hooks.onChange.call(es);
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

  return (
    <div className="miuffy-editor-root">
      <StyleControls editorState={editorState} />

      <div className="miuffy-editor">
        <Title />
        <Editor
          editorState={editorState}
          blockStyleFn={getBlockStyle}
          blockRendererFn={handleBlockRender}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          handleDroppedFiles={handleDroppedFiles}
          ref={forwardRef}
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
