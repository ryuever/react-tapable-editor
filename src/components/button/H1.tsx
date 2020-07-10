import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const H1: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <g>
        <path d="M5.53 11h6.96V5.34c0-.18.16-.34.35-.34h.82c.2 0 .36.16.36.34v13.3c0 .2-.16.35-.36.35h-.82a.35.35 0 0 1-.35-.34v-6.17H5.53v6.17c0 .19-.16.34-.36.34h-.82a.35.35 0 0 1-.35-.34V5.36c0-.2.16-.35.35-.35h.82c.2 0 .36.16.36.34V11z" />
        <path d="M16.59 13.5c-.1.06-.24 0-.24-.13v-1.2a.3.3 0 0 1 .15-.26l1.6-.87a.3.3 0 0 1 .15-.04h1c.16 0 .3.13.3.3v7.4a.3.3 0 0 1-.3.3h-.93a.3.3 0 0 1-.3-.3v-5.96l-1.43.75z" />
      </g>
    </svg>
  );
};

export default withFillColor(withAction(H1));
