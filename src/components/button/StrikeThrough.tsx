import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const StrikeThrough: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <g>
        <path d="M9.47 10H7.41a3.82 3.82 0 0 1 .77-4.13 4.88 4.88 0 0 1 3.68-1.37c1.61 0 2.84.43 3.65 1.27.53.51.83 1.04 1.07 1.95.06.2.03.35-.07.36l-1.4.26c-.1.02-.13-.02-.18-.23-.1-.51-.24-.8-.52-1.12-.55-.7-1.43-1.07-2.54-1.07-1.8 0-3.11 1.05-3.15 2.55-.01.63.26 1.18.75 1.53zm4.33 2.94H5.9a.4.4 0 0 1-.4-.4v-.6c0-.23.18-.4.4-.4h12.32c.23 0 .4.17.4.4v.6a.4.4 0 0 1-.4.4h-1.94c.4.6.72 1.46.7 2.29-.06 2.63-2.08 4.27-5.3 4.27-2.16 0-3.77-.72-4.6-2.06a4.61 4.61 0 0 1-.6-1.58c-.07-.37-.05-.4.25-.46l1.06-.2c.33-.07.37-.04.43.27.14.73.34 1.15.75 1.57.6.65 1.57.98 2.82.98 2.13 0 3.52-1.04 3.56-2.7.02-.8-.23-1.4-.75-1.78l-.8-.6z" />
      </g>
    </svg>
  );
};

export default withFillColor(withAction(StrikeThrough));
