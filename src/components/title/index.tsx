import React, { FC } from 'react';
import withEditor from '../../withEditor';
import { ReturnProps } from '../../types';

import './styles/index.css';

const Title: FC<ReturnProps> = () => (
  <div className="article-title">
    <input className="title-input" placeholder="Untitled" />
  </div>
);

export default withEditor(Title);
