import React, { useState, useRef, useEffect, useCallback } from 'react'
import { withEditor } from '../../index';
import Immutable from 'immutable'
import './styles.css'

import H1 from '../button/H1'
import H2 from '../button/H2'
import H3 from '../button/H3'
import H4 from '../button/H4'
import Blockquote from '../button/Blockquote'

import Bold from '../button/Bold'
import Italic from '../button/Italic'
import StrikeThrough from '../button/StrikeThrough'
import Underline from '../button/Underline'
import InlineCode from '../button/InlineCode'
import Link from '../button/Link'
import Unlink from '../button/Unlink'

import NumberedList from '../button/NumberedList'
import BulletedList from '../button/BulletedList'

import getSelectionInlineStyle from '../../utils/getSelectionInlineStyle'
import getSelectionBlockTypes from '../../utils/getSelectionBlockTypes'
import { createLinkSpanAtSelection } from '../../utils/createEntity'

const Divider = () => <div className="divider" />

const buildBlockTypeHandler = (getEditor, type) => () => {
  const { hooks, editorState } = getEditor()
  hooks.toggleBlockType.call(editorState, type);
}

const buildInlineTypeHandler = (getEditor, inlineStyle) => () => {
  const { hooks } = getEditor()
  hooks.toggleInlineStyleV2.call(inlineStyle);
}

const H1Button = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'header-one'
  ))
  return <H1 active={active} onClick={handleClick.current}/>
}
const H2Button = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'header-two'
  ))
  return <H2 active={active} onClick={handleClick.current}/>
}
const H3Button = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'header-three'
  ))
  return <H3 active={active} onClick={handleClick.current}/>
}
const H4Button = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'header-four'
  ))
  return <H4 active={active} onClick={handleClick.current}/>
}
const BlockquoteButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'blockquote'
  ))
  return <Blockquote active={active} onClick={handleClick.current}/>
}
const BoldButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    'BOLD'
  ))
  return <Bold active={active} onClick={handleClick.current}/>
}
const ItalicButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    'ITALIC'
  ))
  return <Italic active={active} onClick={handleClick.current}/>
}
const StrikeThroughButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    'STRIKE-THROUGH'
  ))
  return <StrikeThrough active={active} onClick={handleClick.current}/>
}
const UnderlineButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    'UNDERLINE'
  ))
  return <Underline active={active} onClick={handleClick.current}/>
}
const InlineCodeButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    'CODE'
  ))
  return <InlineCode active={active} onClick={handleClick.current}/>
}
const LinkButton = ({ handleClick, getEditor }) => {
  const onClickHandler = () => {
    const { editorState, hooks } = getEditor()
    const nextState = createLinkSpanAtSelection(editorState)
    hooks.setState.call(nextState)
    handleClick()
  }
  return <Link onClick={onClickHandler}/>
}
const NumberedListButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'ordered-list-item'
  ))
  return <NumberedList active={active} onClick={handleClick.current}/>
}
const BulletedListButton = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    'unordered-list-item'
  ))
  return <BulletedList active={active} onClick={handleClick.current} />
}

const onlyContains = (arr = [], item) => {
  if (arr.length > 1) return false
  return arr[0] === item
}

const DisplayContent = ({ blockTypes, styles, getEditor, toggleDisplayMode }) => {
  return (
    <div className="inline-toolbar-inner">
      <div className="inline-toolbar-action-group">
        <H1Button
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'header-one')}
        />
        <H2Button
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'header-two')}
        />
        <H3Button
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'header-three')}
        />
        <H4Button
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'header-four')}
        />
        <BlockquoteButton
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'blockquote')}
        />

        <Divider />

        <BoldButton
          getEditor={getEditor}
          active={styles.has('BOLD')}
        />
        <ItalicButton
          getEditor={getEditor}
          active={styles.has('ITALIC')}
        />
        <StrikeThroughButton
          getEditor={getEditor}
          active={styles.has('STRIKE-THROUGH')}
        />
        <UnderlineButton
          getEditor={getEditor}
          active={styles.has('UNDERLINE')}
        />
        <InlineCodeButton
          getEditor={getEditor}
          active={styles.has('CODE')}
        />

        <LinkButton handleClick={toggleDisplayMode} getEditor={getEditor}/>

        <Divider />

        <NumberedListButton
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'ordered-list-item')}
        />
        <BulletedListButton
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'unordered-list-item')}
        />
      </div>
    </div>
  )
}

const InputBar = ({ getEditor }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="inline-toolbar-link-inner">
      <input
        ref={inputRef}
        className="inline-link-input"
      />
      <Divider />
      <div className='link-action-group'>
        <LinkButton
          getEditor={getEditor}
          active={false}
        />
        <Unlink
          active={false}
        />
      </div>
    </div>
  )
}

const Toolbar = props => {
  const { forwardRef, getEditor } = props
  const [value, setValue] = useState({
    styles: new Immutable.OrderedSet(),
    blockTypes: [],
    inDisplayMode: true,
  })
  const inDisplayModeRef = useRef(true)

  useEffect(() => {
    const { hooks } = getEditor()
    hooks.inlineBarChange.tap('InlineToolbar', (editorState, visibility) => {
      const nextValue = {
        inDisplayMode: visibility === 'hidden' ? true : inDisplayModeRef.current
      }

      if (editorState) {
        nextValue.styles = getSelectionInlineStyle(editorState)
        nextValue.blockTypes = getSelectionBlockTypes(editorState)
      } else {
        nextValue.styles = new Immutable.OrderedSet()
        nextValue.blockTypes = []
      }

      inDisplayModeRef.current = nextValue.inDisplayMode

      setValue(nextValue)
    })
  }, [])

  const toggleDisplayMode = useCallback(() => {
    setValue({
      ...value,
      inDisplayMode: !inDisplayMode,
    })
    inDisplayModeRef.current = !inDisplayMode
  }, [inDisplayMode])

  const { styles, blockTypes, inDisplayMode } = value

  return (
    <div className="inline-toolbar" ref={forwardRef}>
      {inDisplayMode && (
        <DisplayContent
          styles={styles}
          blockTypes={blockTypes}
          getEditor={getEditor}
          toggleDisplayMode={toggleDisplayMode}
        />
      )}
      {!inDisplayMode && <InputBar getEditor={getEditor}/>}
      <div className="arrow-down" />
    </div>
  )
}

const MemoToolbar = React.memo(props => {
  return <Toolbar {...props} />
}, () => true)

export default withEditor(MemoToolbar)