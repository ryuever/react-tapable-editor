import React, { useState, useRef, useEffect } from 'react'
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

import NumberedList from '../button/NumberedList'
import BulletedList from '../button/BulletedList'

import getSelectionInlineStyle from '../../utils/getSelectionInlineStyle'
import getSelectionBlockTypes from '../../utils/getSelectionBlockTypes'
const Divider = () => <div className="divider" />

const buildBlockTypeHandler = (getEditor, index, setActiveKey, type) => () => {
  const { hooks, editorState } = getEditor()
  setActiveKey(index)
  hooks.toggleBlockType.call(editorState, type);
}

const buildInlineTypeHandler = (getEditor, index, setActiveKey, inlineStyle) => () => {
  const { hooks } = getEditor()
  setActiveKey(index)
  hooks.toggleInlineStyleV2.call(inlineStyle);
}

const H1Button = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'header-one'
  ))
  return <H1 active={active} onClick={handleClick.current}/>
}
const H2Button = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'header-two'
  ))
  return <H2 active={active} onClick={handleClick.current}/>
}
const H3Button = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'header-three'
  ))
  return <H3 active={active} onClick={handleClick.current}/>
}
const H4Button = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'header-four'
  ))
  return <H4 active={active} onClick={handleClick.current}/>
}
const BlockquoteButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'blockquote'
  ))
  return <Blockquote active={active} onClick={handleClick.current}/>
}
const BoldButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'BOLD'
  ))
  return <Bold active={active} onClick={handleClick.current}/>
}
const ItalicButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'ITALIC'
  ))
  return <Italic active={active} onClick={handleClick.current}/>
}
const StrikeThroughButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'STRIKE-THROUGH'
  ))
  return <StrikeThrough active={active} onClick={handleClick.current}/>
}
const UnderlineButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'UNDERLINE'
  ))
  return <Underline active={active} onClick={handleClick.current}/>
}
const InlineCodeButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'CODE'
  ))
  return <InlineCode active={active} onClick={handleClick.current}/>
}
const LinkButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'UNDERLINE'
  ))
  return <Link active={active} onClick={handleClick.current}/>
}
const NumberedListButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'ordered-list-item'
  ))
  return <NumberedList active={active} onClick={handleClick.current}/>
}
const BulletedListButton = ({ activeKey, setActiveKey, active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(
    getEditor,
    activeKey,
    setActiveKey,
    'unordered-list-item'
  ))
  return <BulletedList active={active} onClick={handleClick.current} />
}

const onlyContains = (arr = [], item) => {
  if (arr.length > 1) return false
  return arr[0] === item
}

const Toolbar = props => {
  const { forwardRef, getEditor } = props
  const [activeKey, setActiveKey] = useState()
  const [value, setValue] = useState({
    styles: new Immutable.OrderedSet(),
    blockTypes: [],
  })

  useEffect(() => {
    const { hooks } = getEditor()
    hooks.selectionRangeChange.tap('InlineToolbar', (editorState, payload) => {
      const styles = getSelectionInlineStyle(editorState)
      const blockTypes = getSelectionBlockTypes(editorState)
      setValue({
        styles,
        blockTypes,
      })
    })
  }, [])

  return (
    <div className="inline-toolbar" ref={forwardRef}>
      <div className="inline-toolbar-inner">
        <div className="inline-toolbar-action-group">
          <H1Button
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'header-one')}
            setActiveKey={setActiveKey}
          />
          <H2Button
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'header-two')}
            setActiveKey={setActiveKey}
          />
          <H3Button
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'header-three')}
            setActiveKey={setActiveKey}
          />
          <H4Button
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'header-four')}
            setActiveKey={setActiveKey}
          />
          <BlockquoteButton
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'blockquote')}
            setActiveKey={setActiveKey}
          />

          <Divider />

          <BoldButton
            getEditor={getEditor}
            active={value.styles.has('BOLD')}
            setActiveKey={setActiveKey}
          />
          <ItalicButton
            getEditor={getEditor}
            active={value.styles.has('ITALIC')}
            setActiveKey={setActiveKey}
          />
          <StrikeThroughButton
            getEditor={getEditor}
            active={value.styles.has('STRIKE-THROUGH')}
            setActiveKey={setActiveKey}
          />
          <UnderlineButton
            getEditor={getEditor}
            active={value.styles.has('UNDERLINE')}
            setActiveKey={setActiveKey}
          />
          <InlineCodeButton
            getEditor={getEditor}
            active={value.styles.has('CODE')}
            setActiveKey={setActiveKey}
          />
          <LinkButton
            getEditor={getEditor}
            activeKey="link"
            active={'link' === activeKey}
            setActiveKey={setActiveKey}
          />

          <Divider />

          <NumberedListButton
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'ordered-list-item')}

            setActiveKey={setActiveKey}
          />
          <BulletedListButton
            getEditor={getEditor}
            active={onlyContains(value.blockTypes, 'unordered-list-item')}
            setActiveKey={setActiveKey}
          />
        </div>
      </div>

      <div className="arrow-down" />
    </div>
  )
}

const MemoToolbar = React.memo(props => {
  return <Toolbar {...props} />
}, () => true)

export default withEditor(MemoToolbar)