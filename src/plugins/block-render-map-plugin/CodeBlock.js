import React, { Component } from 'react';

import './styles.css';

class CodeWrapper extends Component {
  constructor(props) {
    super(props);

    const { children } = props;
    this.state = {
      code: children,
    };
  }

  render() {
    const { children } = this.props;

    return <div className="code-mirror">{children}</div>;
  }
}

export default CodeWrapper;
