import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const Underline: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <g>
        <g transform="translate(5 5)">
          <path d="M3.5.4v5.1c0 2.27 1.33 4 3.5 4s3.5-1.73 3.5-4V.4c0-.22.18-.4.4-.4h.7c.22 0 .4.18.4.4v5.1c0 3.17-1.96 5.5-5 5.5S2 8.67 2 5.5V.4c0-.22.18-.4.4-.4h.7c.22 0 .4.18.4.4z" />
          <rect y="13.5" width="14" height="1.5" rx=".4" />
        </g>
      </g>
    </svg>
  );
};

export default withFillColor(withAction(Underline));
