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

import './style.css';
// https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
import 'draft-js/dist/Draft.css';
import { withEditor } from './index';

const NewEditor = (props) => {
  const {
    getEditor,
    forwardRef,
    placeholder,
  } = props;
  const { hooks, editorState } = getEditor();
  const didUpdate = useRef(false);
  const selection = editorState.getSelection()

  const hasFocus = selection.getHasFocus()
  const prevHasFocus = useRef(hasFocus)

  useEffect(() => {
    if (didUpdate.current) {
      hooks.didUpdate.call(editorState);
      hooks.updatePlaceholder.call(editorState, placeholder);
    }
  });

  useEffect(() => {
    hooks.updatePlaceholder.call(editorState, placeholder);
    didUpdate.current = true;
  }, []);

  useEffect(() => {
    const { editorState } = getEditor();

    if (prevHasFocus.current && !hasFocus) {
      console.log('trigger blur')
      hooks.onSelectionBlur.call(editorState)
    }

    prevHasFocus.current = hasFocus
  }, [hasFocus])

  const onChange = useCallback((es) => {
    hooks.onChange.call(es);
  }, []);

  const handleKeyCommand = useCallback((command, es) => (
    hooks.handleKeyCommand.call(command, es)
  ), []);

  const getBlockStyle = useCallback((block) => hooks.blockStyleFn.call(block));

  const handleBlockRender = useCallback((contentBlock) => (
    hooks.blockRendererFn.call(contentBlock, editorState)
  ));

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
    </div>
  );
};

const WrappedEditor = withEditor(NewEditor);

export default React.forwardRef((props, ref) => (
  <WrappedEditor {...props} forwardRef={ref} />
));
