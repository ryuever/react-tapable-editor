import React, { useRef, FC } from 'react';

import H1 from '../button/H1';
import H2 from '../button/H2';
import H3 from '../button/H3';
import H4 from '../button/H4';
import Blockquote from '../button/Blockquote';
import CodeBlock from '../button/CodeBlock';

import Bold from '../button/Bold';
import Italic from '../button/Italic';
import StrikeThrough from '../button/StrikeThrough';
import Underline from '../button/Underline';
import InlineCode from '../button/InlineCode';
import Link from '../button/Link';

import NumberedList from '../button/NumberedList';
import BulletedList from '../button/BulletedList';

import { createLinkSpanAtSelection } from '../../utils/createEntity';
import Divider from './Divider';

import {
  GetEditor,
  StyleControlsButtonProps,
  LinkControlsProps,
  StyleControlsProps,
} from '../../types';

const buildBlockTypeHandler = (getEditor: GetEditor, type: string) => () => {
  const { hooks, editorState } = getEditor();
  hooks.toggleBlockType.call(editorState, type);
};

const buildInlineTypeHandler = (
  getEditor: GetEditor,
  inlineStyle: string
) => () => {
  const { hooks } = getEditor();
  hooks.toggleInlineStyleV2.call(inlineStyle);
};

const H1Button: FC<StyleControlsButtonProps> = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(getEditor, 'header-one'));
  return <H1 active={active} onClick={handleClick.current} />;
};
const H2Button: FC<StyleControlsButtonProps> = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(getEditor, 'header-two'));
  return <H2 active={active} onClick={handleClick.current} />;
};
const H3Button: FC<StyleControlsButtonProps> = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(getEditor, 'header-three'));
  return <H3 active={active} onClick={handleClick.current} />;
};
const H4Button: FC<StyleControlsButtonProps> = ({ active, getEditor }) => {
  const handleClick = useRef(buildBlockTypeHandler(getEditor, 'header-four'));
  return <H4 active={active} onClick={handleClick.current} />;
};
const BlockquoteButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(buildBlockTypeHandler(getEditor, 'blockquote'));
  return <Blockquote active={active} onClick={handleClick.current} />;
};
const CodeBlockButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(buildBlockTypeHandler(getEditor, 'code-block'));
  return <CodeBlock active={active} onClick={handleClick.current} />;
};
const BoldButton: FC<StyleControlsButtonProps> = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(getEditor, 'BOLD'));
  return <Bold active={active} onClick={handleClick.current} />;
};
const ItalicButton: FC<StyleControlsButtonProps> = ({ active, getEditor }) => {
  const handleClick = useRef(buildInlineTypeHandler(getEditor, 'ITALIC'));
  return <Italic active={active} onClick={handleClick.current} />;
};
const StrikeThroughButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(
    buildInlineTypeHandler(getEditor, 'STRIKE-THROUGH')
  );
  return <StrikeThrough active={active} onClick={handleClick.current} />;
};
const UnderlineButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(buildInlineTypeHandler(getEditor, 'UNDERLINE'));
  return <Underline active={active} onClick={handleClick.current} />;
};
const InlineCodeButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(buildInlineTypeHandler(getEditor, 'CODE'));
  return <InlineCode active={active} onClick={handleClick.current} />;
};
const LinkButton: FC<LinkControlsProps> = ({
  handleClick,
  getEditor,
  active,
}) => {
  const onClickHandler = () => {
    const { editorState, hooks } = getEditor();
    hooks.afterClickLinkButton.call(editorState);
    const nextState = createLinkSpanAtSelection(editorState);
    hooks.setState.call(nextState);
    handleClick();
  };
  return <Link onClick={onClickHandler} active={active} />;
};
const NumberedListButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(
    buildBlockTypeHandler(getEditor, 'ordered-list-item')
  );
  return <NumberedList active={active} onClick={handleClick.current} />;
};
const BulletedListButton: FC<StyleControlsButtonProps> = ({
  active,
  getEditor,
}) => {
  const handleClick = useRef(
    buildBlockTypeHandler(getEditor, 'unordered-list-item')
  );
  return <BulletedList active={active} onClick={handleClick.current} />;
};

const onlyContains = (arr: string[] = [], item: string) => {
  if (arr.length > 1) return false;
  return arr[0] === item;
};

const StyleControls: FC<StyleControlsProps> = ({
  blockTypes,
  styles,
  getEditor,
  toggleDisplayMode,
  hasLink,
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
        <CodeBlockButton
          getEditor={getEditor}
          active={onlyContains(blockTypes, 'code-block')}
        />

        <Divider />

        <BoldButton getEditor={getEditor} active={styles.has('BOLD')} />
        <ItalicButton getEditor={getEditor} active={styles.has('ITALIC')} />
        <StrikeThroughButton
          getEditor={getEditor}
          active={styles.has('STRIKE-THROUGH')}
        />
        <UnderlineButton
          getEditor={getEditor}
          active={styles.has('UNDERLINE')}
        />
        <InlineCodeButton getEditor={getEditor} active={styles.has('CODE')} />

        <LinkButton
          handleClick={toggleDisplayMode}
          getEditor={getEditor}
          active={hasLink}
        />

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
  );
};

export default StyleControls;
