import React from 'react';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import { GetEditor } from '../../types';
import './styles/index.css';

const StyleControls = ({ getEditor }: { getEditor: GetEditor }) => (
  <div className="miuffy-editor-controls">
    <BlockStyleControls getEditor={getEditor} />
    <div className="delimiter" />
    <InlineStyleControls getEditor={getEditor} />
  </div>
);

export default StyleControls;
