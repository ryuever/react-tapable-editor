import React, { Component } from 'react'

// import CodeMirror from 'react-codemirror'

class CodeWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: props.children
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      code: nextProps.children
    })
  }

  render() {
    console.log('code : ', this.state.code)

    // return <CodeMirror
    //   ref="editor"
    //   value={this.state.code}
    //   // onChange={this.updateCode}
    //   // options={options}
    //   autoFocus={true}
    // />

    return <div className="code-mirror">
      {this.props.children}
    </div>

  }

}

export default CodeWrapper
