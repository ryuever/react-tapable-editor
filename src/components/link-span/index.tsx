import React from 'react';
import { LinkSpanProps } from '../../types';
import './styles.css';

export default (props: LinkSpanProps) => {
  return (
    <a className="link_span" target="blank">
      {props.children}
    </a>
  );
};
