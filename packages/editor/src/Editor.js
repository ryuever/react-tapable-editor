import React, {
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  Editor,
} from 'draft-js';
import getContentEditableContainer from 'draft-js/lib/getContentEditableContainer'
import getDraftEditorSelection from 'draft-js/lib/getDraftEditorSelection'
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
  const isCollapsed = selection.isCollapsed()
  const startKey = selection.getStartKey()
  const hasFocus = selection.getHasFocus()
  const isCollapsedRef= useRef(isCollapsed)
  const startKeyRef = useRef(startKey)
  const hasFocusRef = useRef(hasFocus)

  // const prevStartKey = useRef(startKey)


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
    const payload = {
      type: '',
      newValue: {
        isCollapsed,
        startKey,
        hasFocus,
      },
      oldValue: {
        isCollapsed: isCollapsedRef.current,
        startKey: startKeyRef.current,
        hasFocus: hasFocusRef.current,
      },
    }

    if (isCollapsed !== isCollapsedRef.current) {
      payload.type = 'isCollapsed-change'
    } else if (isCollapsed) {
      if (startKeyRef.current !== startKey || hasFocusRef.current !== hasFocus) {
        payload.type = 'start-key-change'
      }
    }

    if (payload !== '') {
      hooks.onBlockSelectionChange.call(editorState, payload)
    }

    isCollapsedRef.current = isCollapsed
    startKeyRef.current = startKey
    hasFocusRef.current = hasFocus
  }, [isCollapsed, startKey, hasFocus])

  const onChange = useCallback((es) => {
    // console.log('getLastChangeType() : ', es.getLastChangeType())

    // const selection = es.getSelection()
    // if (willCheckSelection.current) {
    //   if (forwardRef.current._blockSelectEvents || forwardRef.current._latestEditorState !== editorState) {
    //     console.log('xxxx')
    //   } else {
    //     console.log('next --')
    //     var documentSelection = getDraftEditorSelection(editorState, getContentEditableContainer(forwardRef.current));
    //     console.log('forwardRef.current : ', forwardRef.current)
    //     var updatedSelectionState = documentSelection.selectionState;
    //     console.log('update selection : ', updatedSelectionState)
    //   }


    //   // willCheckSelection.current = false
    // }

    // console.log('willCheckSelection.current ', willCheckSelection.current)

    // if (willCheckSelection.current) {
    //   const currentStartKey = selection.getStartKey()
    //   const blurKey = startKeyAfterBlur.current
    //   startKeyAfterBlur.current = undefined
    //   willCheckSelection.current = undefined

    //   console.log('current : ', selection.isCollapsed(), blurKey, currentStartKey)

    //   if (selection.isCollapsed()) {
    //     if (blurKey && currentStartKey && blurKey !== currentStartKey) {
    //       return
    //     }
    //   }
    // }

    // console.log('on change : ', es, es.getSelection())
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

  // const handleBlur = useCallback(() => {
  //   const { editorState } = getEditor();
  //   const selection = editorState.getSelection()
  //   const startKey = selection.getStartKey()
  //   if (!selection.isCollapsed()) return
  //   console.log('set : ', startKey)
  //   startKeyAfterBlur.current = startKey
  // }, [])

  // const handleFocus = useCallback(() => {
  //   willCheckSelection.current = true
  // }, [])

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
          // onBlur={handleBlur}
          // onFocus={handleFocus}
        />
      </div>
    </div>
  );
};

const WrappedEditor = withEditor(NewEditor);

export default React.forwardRef((props, ref) => (
  <WrappedEditor {...props} forwardRef={ref} />
));
