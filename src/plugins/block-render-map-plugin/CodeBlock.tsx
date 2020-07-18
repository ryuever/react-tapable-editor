import React, { ReactChild, FC } from 'react';
import './styles.css';

const CodeWrapper: FC<{ children?: ReactChild }> = props => {
  const { children } = props;

  return <div className="code-mirror">{children}</div>;
};

export default CodeWrapper;
