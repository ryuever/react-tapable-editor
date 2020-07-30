import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const InlineCode: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <path d="M9.44 8.3l-3.8 4.13 3.59 4.13c.12.15.12.37-.02.51l-.49.5a.38.38 0 0 1-.55 0L3.9 12.67a.38.38 0 0 1 0-.5l4.5-4.9a.37.37 0 0 1 .54 0l.49.5c.14.14.14.37 0 .52zm9.02 4.13L14.84 8.3a.37.37 0 0 1 .01-.51l.5-.5a.37.37 0 0 1 .54 0l4.32 4.89c.13.14.13.36 0 .5l-4.5 4.9a.38.38 0 0 1-.54 0l-.49-.5a.38.38 0 0 1 0-.52l3.78-4.13zm-5.7-8.35l.74.09c.2.02.35.2.33.41l-1.8 15.38a.38.38 0 0 1-.4.33l-.75-.08a.37.37 0 0 1-.33-.42l1.79-15.38c.02-.2.2-.35.41-.33z" />
    </svg>
  );
};

export default withFillColor(withAction(InlineCode));
