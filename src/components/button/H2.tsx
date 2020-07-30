import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const H2: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <g>
        <path d="M5.53 10.98h6.96V5.34c0-.19.16-.34.35-.34h.82c.2 0 .36.15.36.34v13.3c0 .2-.16.35-.36.35h-.82a.35.35 0 0 1-.35-.34v-6.17H5.53v6.17c0 .18-.16.34-.36.34h-.82a.35.35 0 0 1-.35-.34V5.35c0-.2.16-.35.35-.35h.82c.2 0 .36.15.36.34v5.64z" />
        <path d="M21 17.69v.92a.3.3 0 0 1-.3.3h-4.4a.3.3 0 0 1-.3-.3v-.95a.3.3 0 0 1 .07-.19l3.3-4.12c.11-.16.2-.3.23-.42s.04-.24.04-.35c0-.28-.08-.53-.26-.74a.98.98 0 0 0-.76-.32c-.3 0-.54.1-.74.29-.2.19-.32.45-.36.81 0 .08-.06.14-.14.14h-1.22a.16.16 0 0 1-.16-.16c.03-.75.29-1.37.76-1.86a2.44 2.44 0 0 1 1.76-.74c.78 0 1.41.26 1.9.75.49.48.74 1.1.75 1.84 0 .6-.18 1.13-.55 1.6l-2.55 3.2h2.63c.17 0 .3.13.3.3z" />
      </g>
    </svg>
  );
};

export default withFillColor(withAction(H2));
