import React, { FC, ReactChild } from 'react';
// import classes from "classnames";
import './nextDiv.css';
// import useFocus from '../../hooks/useFocus'

const NextDiv: FC<{ children?: ReactChild }> = props => {
  const { children } = props;

  return <>{children}</>;
};

export default NextDiv;
