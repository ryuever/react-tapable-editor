import React, { useCallback, useState } from 'react'
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

const Divider = () => <div className="divider" />

const H1Button = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <H1 active={active} onClick={handleClick}/>
}
const H2Button = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <H2 active={active} onClick={handleClick}/>
}
const H3Button = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <H3 active={active} onClick={handleClick}/>
}
const H4Button = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <H4 active={active} onClick={handleClick}/>
}
const BlockquoteButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <Blockquote active={active} onClick={handleClick}/>
}
const BoldButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <Bold active={active} onClick={handleClick}/>
}
const ItalicButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <Italic active={active} onClick={handleClick}/>
}
const StrikeThroughButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <StrikeThrough active={active} onClick={handleClick}/>
}
const UnderlineButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <Underline active={active} onClick={handleClick}/>
}
const InlineCodeButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <InlineCode active={active} onClick={handleClick}/>
}
const LinkButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <Link active={active} onClick={handleClick}/>
}
const NumberedListButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <NumberedList active={active} onClick={handleClick}/>
}

const BulletedListButton = ({ activeKey, setActiveKey, active }) => {
  const handleClick = useCallback(() => setActiveKey(activeKey))
  return <BulletedList active={active} onClick={handleClick} />
}

const Toolbar = props => {
  const [activeKey, setActiveKey] = useState()

  return (
    <div className="image-toolbar">
      <div className="image-toolbar-inner">
        <div className="image-toolbar-action-group">
          <H1Button
            activeKey="h1"
            active={'h1' === activeKey}
            setActiveKey={setActiveKey}
          />
          <H2Button
            activeKey="h2"
            active={'h2' === activeKey}
            setActiveKey={setActiveKey}
          />
          <H3Button
            activeKey="h3"
            active={'h3' === activeKey}
            setActiveKey={setActiveKey}
          />
          <H4Button
            activeKey="h4"
            active={'h4' === activeKey}
            setActiveKey={setActiveKey}
          />
          <BlockquoteButton
            activeKey="blockquote"
            active={'blockquote' === activeKey}
            setActiveKey={setActiveKey}
          />

          <Divider />

          <BoldButton
            activeKey="bold"
            active={'bold' === activeKey}
            setActiveKey={setActiveKey}
          />
          <ItalicButton
            activeKey="italic"
            active={'italic' === activeKey}
            setActiveKey={setActiveKey}
          />
          <StrikeThroughButton
            activeKey="strike-through"
            active={'strike-through' === activeKey}
            setActiveKey={setActiveKey}
          />
          <UnderlineButton
            activeKey="underline"
            active={'underline' === activeKey}
            setActiveKey={setActiveKey}
          />
          <InlineCodeButton
            activeKey="inline-code"
            active={'inline-code' === activeKey}
            setActiveKey={setActiveKey}
          />
          <LinkButton
            activeKey="link"
            active={'link' === activeKey}
            setActiveKey={setActiveKey}
          />

          <Divider />

          <NumberedListButton
            activeKey="numbered-list"
            active={'numbered-list' === activeKey}
            setActiveKey={setActiveKey}
          />
          <BulletedListButton
            activeKey="bulleted-list"
            active={'bulleted-list' === activeKey}
            setActiveKey={setActiveKey}
          />
        </div>
      </div>
    </div>
  )
}

export default Toolbar