import React, {
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import Title from './components/title';
import ImageToolbar from './components/image-toolbar'
import InlineToolbar from './components/inline-toolbar'
import compareArray from './utils/compareArray'

window.__DRAFT_GKX = {
  'draft_tree_data_support': true,
}

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
  const lastBlockMapKeys = useRef([])
  const isInCompositionModeRef = useRef(false)

  useEffect(() => {
    const currentContent = editorState.getCurrentContent()
    const currentBlockMap = currentContent.getBlockMap()
    const currentBlockMapKeys = currentBlockMap.keySeq().toArray()
    const diff = compareArray(lastBlockMapKeys.current, currentBlockMapKeys)
    const isInCompositionMode = editorState.isInCompositionMode()

    const force = diff.length || (isInCompositionModeRef.current && !isInCompositionMode)

    hooks.syncBlockKeys.call(currentBlockMapKeys, force )
    isInCompositionModeRef.current = editorState.isInCompositionMode()
  })

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

  useEffect(() => {
    const currentContent = editorState.getCurrentContent()
    const currentBlockMap = currentContent.getBlockMap()
    const currentBlockMapKeys = currentBlockMap.keySeq().toArray()
    const diff = compareArray(lastBlockMapKeys.current, currentBlockMapKeys)

    if (diff.length) {
      hooks.updateDragSubscription.call(diff)
    }

    lastBlockMapKeys.current = currentBlockMapKeys
  })

  const onChange = useCallback((newEditorState) => {
    const { editorState } = getEditor();

    const nextState = hooks.stateFilter.call(editorState, newEditorState, pasteText.current)

    const newContentState = nextState.getCurrentContent()
    const blockMap = newContentState.getBlockMap()
    const lastBlock = newContentState.getLastBlock()
    const lastBlockText = lastBlock.getText()

    // console.log('on change hooks', convertToRaw(newContentState))
    const rawState = convertToRaw(newContentState)

    // console.log('rawState.blocks[0] ', rawState.blocks[0])
    // if (!rawState.blocks[0].children.length) {
    //   rawState.blocks[0].children = [{
    //     key: "c1nlb",
    //     text: "helloworld",
    //     type: "unstyled",
    //     depth: 1,
    //     inlineStyleRanges: [],
    //     entityRanges: [],
    //     data: {},
    //     children: [],
    //   }]
    // }

    const state = EditorState.createWithContent(convertFromRaw(rawState))

    // console.log('state : ', nextState, state, rawState)
    // console.log('nextState : ', nextState, newContentState)

    // hooks.onChange.call(state)
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
