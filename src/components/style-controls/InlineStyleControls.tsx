import React, { useCallback } from 'react';
import { GetEditor } from '../../types';
import StyleControlButton from './StyleControlButton';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

// 1. 当切换到输入中文的时候，如果说这个时候点击`inline style button`的话，
//    它是不会生效到下一个中文字符的
// 2. 当换行的时候，上一个block最后字符的`inline-style`无法自动应用到新的一行
//    （新的一行如果说是输入中文）

const InlineStyleControls = ({ getEditor }: { getEditor: GetEditor }) => {
  const { editorState } = getEditor();
  let currentStyle = editorState.getCurrentInlineStyle();
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const handleToggle = useCallback(
    inlineStyle => {
      const { hooks } = getEditor();
      hooks.toggleInlineStyle.call(inlineStyle);
    },
    [getEditor]
  );

  // 主要是为了解决当输入中文的时候，会出现`active inline style`被清空的现象；
  if (!currentStyle.size && selection.isCollapsed()) {
    const block = contentState.getBlockForKey(selection.getAnchorKey());
    const startOffset = selection.getStartOffset();

    const chars = block.getCharacterList();
    const length = chars.size;

    if (length < startOffset) {
      currentStyle = block.getInlineStyleAt(length - 1);
    }
  }

  return (
    <div className="RichEditor-inline-controls">
      {INLINE_STYLES.map(({ label, style }) => (
        <StyleControlButton
          key={label}
          label={label}
          style={style}
          onToggle={handleToggle}
          active={currentStyle.has(style)}
        />
      ))}
    </div>
  );
};

export default InlineStyleControls;
