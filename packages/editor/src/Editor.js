import React, { Component } from 'react'
import {
  Editor,
  RichUtils,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import StyleControls from './style-controls'
import extendedBlockRenderMap from './block-renderer/extendedBlockRenderMap'
import './style.css'

class MiuffyEditor extends Component {
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
        <StyleControls
          editorState={editorState}
          toggleBlockType={this.toggleBlockType}
          toggleInlineStyle={this.toggleInlineStyle}
        />

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

export default MiuffyEditor
