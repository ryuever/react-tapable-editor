import React, { Component, ReactChild } from 'react';

import './styles.css';

class CodeWrapper extends Component<{ children: ReactChild }> {
  constructor(props: { children: ReactChild }) {
    super(props);

    // const { children } = props;
    // this.state = {
    //   code: children,
    // };
  }

  render() {
    const { children } = this.props;

    return <div className="code-mirror">{children}</div>;
  }
}

export default CodeWrapper;
