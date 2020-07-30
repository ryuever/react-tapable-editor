import React from 'react';
import withEditor from '../../withEditor';

import './styles/index.css';

const Title = () => (
  <div className="article-title">
    <input className="title-input" placeholder="Untitled" />
  </div>
);

export default withEditor(Title);
