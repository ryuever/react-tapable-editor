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

const Toolbar = props => {
  const { forwardRef, getEditor } = props
  const [activeKey, setActiveKey] = useState()
  const [styles, setStyles] = useState(new Immutable.OrderedSet())

  useEffect(() => {
    const { hooks } = getEditor()
    hooks.selectionRangeChange.tap('InlineToolbar', (editorState, payload) => {
      const styles = getSelectionInlineStyle(editorState)
      setStyles(styles)
    })
  }, [])

  return (
    <div className="inline-toolbar" ref={forwardRef}>
      <div className="inline-toolbar-inner">
        <div className="inline-toolbar-action-group">
          <H1Button
            getEditor={getEditor}
            activeKey="h1"
            active={styles.has('header-one')}
            setActiveKey={setActiveKey}
          />
          <H2Button
            getEditor={getEditor}
            activeKey="h2"
            active={'h2' === activeKey}
            setActiveKey={setActiveKey}
          />
          <H3Button
            getEditor={getEditor}
            activeKey="h3"
            active={'h3' === activeKey}
            setActiveKey={setActiveKey}
          />
          <H4Button
            getEditor={getEditor}
            activeKey="h4"
            active={'h4' === activeKey}
            setActiveKey={setActiveKey}
          />
          <BlockquoteButton
            getEditor={getEditor}
            activeKey="blockquote"
            active={'blockquote' === activeKey}
            setActiveKey={setActiveKey}
          />

          <Divider />

          <BoldButton
            getEditor={getEditor}
            active={styles.has('BOLD')}
            setActiveKey={setActiveKey}
          />
          <ItalicButton
            getEditor={getEditor}
            active={styles.has('ITALIC')}
            setActiveKey={setActiveKey}
          />
          <StrikeThroughButton
            getEditor={getEditor}
            active={styles.has('STRIKE-THROUGH')}
            setActiveKey={setActiveKey}
          />
          <UnderlineButton
            getEditor={getEditor}
            active={styles.has('UNDERLINE')}
            setActiveKey={setActiveKey}
          />
          <InlineCodeButton
            getEditor={getEditor}
            active={styles.has('CODE')}
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
            activeKey="numbered-list"
            active={'numbered-list' === activeKey}
            setActiveKey={setActiveKey}
          />
          <BulletedListButton
            getEditor={getEditor}
            activeKey="bulleted-list"
            active={'bulleted-list' === activeKey}
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