import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const ImageInsetCenter: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg height="25" width="25" fill={fill}>
      <path
        d="M5 20.558v-.9c0-.122.04-.226.122-.312a.404.404 0 0 1 .305-.13h13.347a.45.45 0 0 1 .32.13c.092.086.138.19.138.312v.9a.412.412 0 0 1-.138.313.435.435 0 0 1-.32.13H5.427a.39.39 0 0 1-.305-.13.432.432 0 0 1-.122-.31zm0-3.554V9.01c0-.12.04-.225.122-.31a.4.4 0 0 1 .305-.13h13.347c.122 0 .23.043.32.13.092.085.138.19.138.31v7.994a.462.462 0 0 1-.138.328.424.424 0 0 1-.32.145H5.427a.382.382 0 0 1-.305-.145.501.501 0 0 1-.122-.328zM5 6.342v-.87c0-.12.04-.23.122-.327A.382.382 0 0 1 5.427 5h13.347c.122 0 .23.048.32.145a.462.462 0 0 1 .138.328v.87c0 .12-.046.225-.138.31a.447.447 0 0 1-.32.13H5.427a.4.4 0 0 1-.305-.13.44.44 0 0 1-.122-.31z"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default withFillColor(withAction(ImageInsetCenter));
