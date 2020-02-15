import React from 'react';
import { withEditor } from '../..';

import './styles/index.css';

const Title = ({ getEditor }) => (
  <div className="article-title">
    <input className="title-input" placeholder="Untitled" />
  </div>
);

export default withEditor(Title);
