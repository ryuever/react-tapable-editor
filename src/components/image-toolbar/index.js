import React, { useCallback, useState, useEffect, useRef } from 'react'

import { withEditor } from '../../index';
import ImageAlignCenter from '../button/ImageAlignCenter'
import ImageAlignLeftFillContent from '../button/ImageAlignLeftFillContent'
import ImageAlignRightFillContent from '../button/ImageAlignRightFillContent'
import ImageAlignLeft from '../button/ImageAlignLeft'
import './styles.css'
import { EditorState, SelectionState } from 'draft-js';

const ImageAlignCenterButton = ({ activeKey, clickHandler, active }) => {
  const handleClick = () => clickHandler(activeKey)
  return <ImageAlignCenter active={active} onClick={handleClick}/>
}

const ImageAlignLeftButton = ({ activeKey, clickHandler, active }) => {
  const handleClick = () => clickHandler(activeKey)
  return <ImageAlignLeft active={active} onClick={handleClick} />
}

const ImageAlignLeftFillContentButton = ({ activeKey, clickHandler, active }) => {
  const handleClick = () => clickHandler(activeKey)
  return <ImageAlignLeftFillContent active={active} onClick={handleClick} />
}

const ImageAlignRightFillContentButton = ({ activeKey, clickHandler, active }) => {
  const handleClick = () => clickHandler(activeKey)
  return <ImageAlignRightFillContent active={active} onClick={handleClick} />
}

const Toolbar = props => {
  const { forwardRef, getEditor } = props
  const { hooks } = getEditor()
  const [alignment, setAlignment] = useState()
  const blockRef = useRef()

  const clickHandler = alignment => {
    const entityKey = blockRef.current.getEntityAt(0);
    if (entityKey) {
      const { editorState } = getEditor()
      const contentState = editorState.getCurrentContent();
      console.log('old editorState : ', editorState)
      const newContent = contentState.mergeEntityData(entityKey, { alignment });
      const nextState = EditorState.push(editorState, newContent)
      // const newState = EditorState.forceSelection(nextState, new SelectionState({
      //   anchorKey: blockRef.current.getKey(),
      //   anchorOffset: 0,
      //   focusKey: blockRef.current.getKey(),
      //   focusOffset: 0,
      //   isBackward: false,
      // }))
      // console.log('editorState.getSelection() : ', editorState.getSelection(), blockRef.current.getKey())

      const newState = EditorState.forceSelection(nextState, nextState.getSelection())

      const newContentState = newState.getCurrentContent()
      const blockMap = newContentState.getBlockMap()
      const lastBlock = newContentState.getLastBlock()
      const lastBlockText = lastBlock.getText()

      console.log('new state :', lastBlockText)
      hooks.setState.call(newState, editorState => {
        const contentState = editorState.getCurrentContent();
        const entity = blockRef.current.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity)
        const type = entityState.getType();
        const data = entityState.getData()
        if (type === 'IMAGE') {
          const { alignment } = data
          if (alignment) setAlignment(alignment)
        }
      })
    }
  }

  useEffect(() => {
    hooks.toggleImageToolbarVisible.tap('ImageToolbar', (visibility, block) => {
      if (visibility) {
        blockRef.current = block
        const { editorState } = getEditor()
        const contentState = editorState.getCurrentContent();
        const entity = blockRef.current.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity)
        const type = entityState.getType();
        const data = entityState.getData()
        if (type === 'IMAGE') {
          const { alignment } = data
          if (alignment) setAlignment(alignment)
        }
      }
    })
  }, [])

  return (
    <div className="image-toolbar" ref={forwardRef}>
      <div className="image-toolbar-inner">
        <div className="image-toolbar-action-group">
          <ImageAlignLeftButton
            activeKey="left"
            active={'left' === alignment}
            clickHandler={clickHandler}
          />
          <ImageAlignLeftFillContentButton
            activeKey="leftFill"
            active={'leftFill' === alignment}
            clickHandler={clickHandler}
          />
          <ImageAlignCenterButton
            activeKey="center"
            active={'center' === alignment}
            clickHandler={clickHandler}
          />
          <ImageAlignRightFillContentButton
            activeKey="rightFill"
            active={'rightFill' === alignment}
            clickHandler={clickHandler}
          />
        </div>
      </div>
      <div className="arrow-down" />
    </div>
  )
}

export default withEditor(Toolbar)