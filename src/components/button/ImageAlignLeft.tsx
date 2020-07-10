import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const ImageAlignLeft: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <path d="M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M3,7 L3,17 L17,17 L17,7 L3,7 Z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
};

export default withFillColor(withAction(ImageAlignLeft));
