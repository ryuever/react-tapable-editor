import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const ImageFillWidth: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg height="25" width="25" fill={fill}>
      <path
        d="M4.027 17.24V5.492c0-.117.046-.216.14-.3a.453.453 0 0 1 .313-.123h17.007c.117 0 .22.04.313.12.093.08.14.18.14.3v11.74c0 .11-.046.21-.14.3a.469.469 0 0 1-.313.12H4.48a.432.432 0 0 1-.314-.13.41.41 0 0 1-.14-.3zm2.943 3.407v-.833a.45.45 0 0 1 .122-.322.387.387 0 0 1 .276-.132H18.61a.35.35 0 0 1 .27.132.472.472 0 0 1 .116.322v.833c0 .117-.04.216-.116.3a.361.361 0 0 1-.27.123H7.368a.374.374 0 0 1-.276-.124.405.405 0 0 1-.122-.3z"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default withFillColor(withAction(ImageFillWidth));
