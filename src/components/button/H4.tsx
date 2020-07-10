import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const H4: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <g>
        <path d="M5.53 10.98h6.96V5.34c0-.19.16-.34.35-.34h.82c.2 0 .36.15.36.34v13.3c0 .2-.16.35-.36.35h-.82a.35.35 0 0 1-.35-.34v-6.17H5.53v6.17c0 .18-.16.34-.36.34h-.82a.35.35 0 0 1-.35-.34V5.35c0-.2.16-.35.35-.35h.82c.2 0 .36.15.36.34v5.64z" />
        <path d="M20 10.43V16h.7c.17 0 .3.13.3.3v.81a.3.3 0 0 1-.3.3H20v1.29a.3.3 0 0 1-.3.3h-.8a.3.3 0 0 1-.3-.3v-1.29h-3.3a.3.3 0 0 1-.3-.3V15.9a.2.2 0 0 1 .04-.1l3.58-5.53a.3.3 0 0 1 .25-.14h.83c.16 0 .3.14.3.3zm-1.4 2.44l-2 3.13h2v-3.13z" />
      </g>
    </svg>
  );
};

export default withFillColor(withAction(H4));
