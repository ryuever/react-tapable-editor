import React, { Component } from 'react'
import {
  Editor,
  RichUtils,
  EditorState,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
} from 'draft-js';
import Immutable from 'immutable'
import classNames from 'classnames'
import CodeWrapper from './CodeWrapper'

const UL_WRAP = <ul className={classNames('miuffy-ul')} />;
const OL_WRAP = <ul className={classNames('miuffy-ol')} />;

import style from './style.css'

const blockRenderMap = Immutable.Map({
  'header-two': {
    element: 'h2'
  },

  'unordered-list-item': {
    element: 'li',
    wrapper: UL_WRAP,
  },

  'ordered-list-item': {
    element: 'li',
    wrapper: OL_WRAP,
  },

  'code-block': {
    element: 'pre',
    wrapper: <CodeWrapper />,
  }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

class RichEditorExample extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

    this.focus = () => this.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  componentDidMount() {
    this.setState({
      isClient: true,
    })
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4, /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const { editorState } = this.state;

    let className = 'miuffy-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="miuffy-editor-root">
        <div className="miuffy-editor-controls">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          {/* <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          /> */}
        </div>
        <div className={className}>
          <div className="miuffy-draft-editor">
            <div className="article-title">
              <input className="title-input" placeholder="Untitled"/>
            </div>

            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Tell a story..."
              ref={editor => this.editor = editor}
              spellCheck={true}
              blockRenderMap={extendedBlockRenderMap}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  console.log('block type : ', block.getType())

  switch (block.getType()) {
    // 控制比如说，最后渲染出来的引用，它的class是
    case 'blockquote':
      return 'miuffy-blockquote';
    case 'unstyled':
      return 'miuffy-paragraph';
    case 'unordered-list-item':
      return 'miuffy-unordered-list-item'
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    const { active, label } = this.props

    let className = 'miuffy-styleButton';
    if (this.props.active) {
      className += ' miuffy-activeButton';
    }

    const labelMap = {
      'H1': 'fas fa-heading',
      'Blockquote': 'fas fa-quote-left',
      'UL': 'fas fa-list-ul',
      'OL': 'fas fa-list-ol',
      'Code Block': 'fas fa-code',
    }

    return (
      <button className={className} onMouseDown={this.onToggle}>
        <span className="label-text">
          {label}
          {/* <i className={labelMap[label]}></i> */}
        </span>
      </button>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  // {label: 'H2', style: 'header-two'},
  // {label: 'H3', style: 'header-three'},
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  console.log('block types : ', BLOCK_TYPES)
  return (
    <div className="RichEditor-block-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-inline-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

export default RichEditorExample
