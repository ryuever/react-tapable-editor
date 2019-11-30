import React from 'react'
import StyleControlButton from './StyleControlButton'

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

export default ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-inline-controls">
      {INLINE_STYLES.map(({ label, style }) =>
        <StyleControlButton
          key={label}
          label={label}
          style={style}
          onToggle={onToggle}
          active={currentStyle.has(style)}
        />
      )}
    </div>
  );
};
