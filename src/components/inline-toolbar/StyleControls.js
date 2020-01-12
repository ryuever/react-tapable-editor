import React, { useRef } from 'react'

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

import NumberedList from '../button/NumberedList'
import BulletedList from '../button/BulletedList'

import { createLinkSpanAtSelection } from '../../utils/createEntity'
import Divider from './Divider'

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

const StyleControls = ({
  blockTypes,
  styles,
  getEditor,
  toggleDisplayMode
}) => {
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

export default StyleControls