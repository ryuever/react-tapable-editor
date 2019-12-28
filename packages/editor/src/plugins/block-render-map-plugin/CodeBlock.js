import React, { Component } from 'react';

// import CodeMirror from 'react-codemirror'

class CodeWrapper extends Component {
  constructor(props) {
    super(props);

    const { children } = props
    this.state = {
      code: children,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      code: nextProps.children,
    });
  }

  render() {
    // return <CodeMirror
    //   ref="editor"
    //   value={this.state.code}
    //   // onChange={this.updateCode}
    //   // options={options}
    //   autoFocus={true}
    // />
    const { children } = this.props

    return (
      <div className="code-mirror">
        {children}
      </div>
    );
  }
}

export default CodeWrapper;
