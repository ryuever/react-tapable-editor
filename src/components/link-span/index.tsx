import React from 'react';
import { LinkSpanProps } from '../../types';
import './styles.css';

export default (props: LinkSpanProps) => {
  return <span className="link_span">{props.children}</span>;
};
