import React, {
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  CharacterMetadata,
} from 'draft-js';
import Title from './components/title';
import ImageToolbar from './components/image-toolbar'
import InlineToolbar from './components/inline-toolbar'
import Immutable from 'immutable'


import './style.css';
// https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
import 'draft-js/dist/Draft.css';

import { withEditor } from './index';

const OrderedSet = Immutable.OrderedSet;
var Repeat = Immutable.Repeat;
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
    const contentState = es.getCurrentContent()
    const blockMap = contentState.getBlockMap()
    console.log('+++++++++ handle change', blockMap, es.getLastChangeType())

    let index = 0
    let changedKey
    let newBlock
    let newState
    let selection = es.getSelection()
    let newContent

    if (es.getLastChangeType() === 'insert-fragment') {
      blockMap.skipUntil(function(block, k) {
        console.log('++++++++++++block type : ', block.getType())
        return block.getType() === 'code-block'
      }).map(function(block, key) {
        if (!index) {
          changedKey = key
          newBlock = block

          // nextState = RichUtils.insertSoftNewline(es)
          // // newContent = Modifier.splitBlock(contentState, selection)
          // selection = nextState.getSelection()
        } else {
          console.log('selection --------', selection, newBlock.getText())
          console.log('selection -------- after ', block.getText())
          // const hh = block.getText()
          // newContent = Modifier.insertText(newContent, selection, hh)
          // newContent = Modifier.splitBlock(newContent, selection)
          // selection = newContent.getSelectionAfter()

          // nextState = RichUtils.insertSoftNewline(es)

          newBlock = newBlock.merge({
            text: newBlock.getText() + '\n' + block.getText(),
            characterList: newBlock.getCharacterList().concat(Repeat(CharacterMetadata.create({
              style: OrderedSet(),
              entity: null
            }), 1).toList(), block.getCharacterList()),

            // text: newBlock.getText() + block.getText(),
            // characterList: newBlock.getCharacterList().concat(block.getCharacterList()),
          })

          console.log('new block : ', newBlock)
        }
        index++
      })


      console.log('new current : ', newContent)

      if (newBlock) {
        const newContentState = contentState.merge({
          blockMap: blockMap.set(changedKey, newBlock),
        })


        newState = EditorState.set(es, {
          currentContent: newContentState
        })
      }
    }

    console.log('new state ', newState)
    if (newState) {
      hooks.onChange.call(newState);
    } else {
      hooks.onChange.call(es);
    }

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
    console.log('text : ', text)
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
