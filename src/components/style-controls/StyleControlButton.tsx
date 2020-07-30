import React, { useCallback } from 'react';
import classnames from 'classnames';
import { StyleControlButtonProps, Label } from '../../types';

const StyleControlButton = ({
  label,
  active,
  onToggle,
  style,
}: StyleControlButtonProps) => {
  const handleMouseDown = useCallback(
    e => {
      e.preventDefault();
      if (typeof onToggle === 'function') {
        onToggle(style);
      }
    },
    [onToggle, style]
  );

  const cx = classnames({
    'miuffy-style-button': true,
    'miuffy-active-button': active,
  });

  return (
    <button className={cx} onMouseDown={handleMouseDown}>
      <span className="label-text">
        {label}
        <i className={Label[label]} />
      </span>
    </button>
  );
};

export default StyleControlButton;
