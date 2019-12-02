import React, { Component } from 'react'
import {
  Editor,
  RichUtils,
  EditorState,
  Modifier,
  getDefaultKeyBinding,
} from 'draft-js';
import StyleControls from './style-controls'
import extendedBlockRenderMap from './block-renderer/extendedBlockRenderMap'
import './style.css'

// https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#missing-draftcss
import 'draft-js/dist/Draft.css'

class MiuffyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      selectionWithNonWidthCharacter: {},
    };

    this.focus = () => this.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  componentDidUpdate() {
    const { editorState, selectionWithNonWidthCharacter } = this.state
    const selection = editorState.getSelection()
    if (selection.isCollapsed()) {
      const startKey = selection.getStartKey()
      const contentState = editorState.getCurrentContent()
      const block = contentState.getBlockForKey(startKey)
      const size = block.getLength()
      if (selectionWithNonWidthCharacter[startKey]) {
        const markerOffset = selectionWithNonWidthCharacter[startKey].getFocusOffset()
        if (markerOffset >= size - 1) return
        const newContent = Modifier.removeRange(
          editorState.getCurrentContent(),
          selectionWithNonWidthCharacter[startKey].merge({
            focusOffset: markerOffset + 1,
          }),
          'backward'
        )
        delete selectionWithNonWidthCharacter[startKey]

        const es = EditorState.push(editorState, newContent, 'delete-character')

        this.setState({
          editorState: EditorState.forceSelection(es, selection.merge({
            anchorKey: startKey,
            anchorOffset: selection.getAnchorOffset() - 1,
            focusKey: startKey,
            focusOffset: selection.getAnchorOffset() - 1,
            isBackward: false,
            hasFocus: true
          })),
          selectionWithNonWidthCharacter: {...selectionWithNonWidthCharacter}
        })
        console.log('section : ', selectionWithNonWidthCharacter)
      }
    }
  }

  _handleKeyCommand(command, editorState) {
    if (command === 'split-block') {
      const selection = editorState.getSelection()
      const currentContent = editorState.getCurrentContent()
      const endKey = selection.getEndKey()
      const block = currentContent.getBlockForKey(endKey)
      const size = block.getLength()
      const focusOffset = selection.getFocusOffset()

      console.log('focusOffset : ', focusOffset, size)
      if (focusOffset === size) {
        const inlineStyle = editorState.getCurrentInlineStyle()
        console.log('inline : ', inlineStyle)

        const endOffset = selection.getFocusOffset()
        const entityKey = block.getEntityAt(endOffset)

        const nextContent = Modifier.replaceText(
          editorState.getCurrentContent(),
          selection,
          "\u200B",
          inlineStyle,
          entityKey,
        )

        const nextState = EditorState.push(editorState, Modifier.splitBlock(
          nextContent,
          selection,
        ), 'split-block');

        this.setState({
          editorState: nextState,
        })

        return true
      }
    }
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
    const { editorState, selectionWithNonWidthCharacter } = this.state
    const newEditorState = RichUtils.toggleInlineStyle(editorState, inlineStyle)
    this.setState({
      editorState: newEditorState,
    }, () => {
      const { editorState: nextEditorState } = this.state
      const selection = nextEditorState.getSelection()

      if (selection.isCollapsed()) {
        const nextCurrentState = nextEditorState.getCurrentContent()
        const nextSelection = nextEditorState.getSelection()
        const nextInlineStyle = nextEditorState.getCurrentInlineStyle()

        const startOffset = selection.getStartOffset()
        const startKey = selection.getStartKey()
        const block = nextCurrentState.getBlockForKey(startKey)
        const entityKey = block.getEntityAt(startOffset)

        // 查看一下最后的字符是否是`\u200B`;如果是的话，则直接将它替换掉，而不是再添加一个
        const len = block.getLength()
        const text = block.getText()
        const lastCharacter = text[len - 1]
        let newCurrentState
        let action
        let markerSelection

        if (lastCharacter === '\u200B') {
          markerSelection = nextSelection.merge({
            anchorOffset: len - 1,
            focusOffset: len,
          })
          newCurrentState = Modifier.applyInlineStyle(
            nextCurrentState,
            markerSelection,
            inlineStyle,
          )
          action = 'change-inline-style'
        } else {
          markerSelection = nextSelection
          newCurrentState = Modifier.replaceText(
            nextCurrentState,
            nextSelection,
            "\u200B",
            nextInlineStyle,
            entityKey,
          )
          action = 'insert-characters'
        }

        const next = EditorState.push(nextEditorState, newCurrentState, action)
        this.setState({
          editorState: EditorState.forceSelection(next, next.getSelection()),
          selectionWithNonWidthCharacter: {
            ...selectionWithNonWidthCharacter,
            [startKey]: markerSelection,
          }
        })
      }
    })
  }

  // 包含两个参数`dropSelection`可以得到放置的位置
  handleDrop = (dropSelection, data, dragType) => {
    console.log('dropSelection', dropSelection, data, dragType)

    // return false
  }

  render() {
    const {
      editorState,
      activeBlockStyleType,
      activeInlineStyleType,
    } = this.state;

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
          activeBlockStyleType={activeBlockStyleType}
          activeInlineStyleType={activeInlineStyleType}
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
              handleDrop={this.handleDrop}
              handleDroppedFiles={this.handleDrop}
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

// 控制渲染出来的block的class；
function getBlockStyle(block) {
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
