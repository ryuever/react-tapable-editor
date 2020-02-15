import React, { useCallback } from 'react';
import classnames from 'classnames';

const labelMap = {
  H1: 'fas fa-heading',
  Blockquote: 'fas fa-quote-left',
  UL: 'fas fa-list-ul',
  OL: 'fas fa-list-ol',
  'Code Block': 'fas fa-code',
};

const StyleControlButton = ({
  label, active, onToggle, style,
}) => {
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    if (typeof onToggle === 'function') {
      onToggle(style);
    }
  }, []);

  const cx = classnames({
    'miuffy-style-button': true,
    'miuffy-active-button': active,
  });

  return (
    <button
      className={cx}
      onMouseDown={handleMouseDown}
    >
      <span className="label-text">
        {label}
        <i className={labelMap[label]} />
      </span>
    </button>
  );
};

export default StyleControlButton;
