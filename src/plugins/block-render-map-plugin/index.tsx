import React from 'react';
import { DefaultDraftBlockRenderMap } from 'draft-js';
import Immutable from 'immutable';
import classNames from 'classnames';

import CodeBlock from './CodeBlock';
import NextDiv from './NextDiv';
import { GetEditor } from '../../types';

const UL_WRAP = <ul className={classNames('miuffy-ul')} />;
const OL_WRAP = <ol className={classNames('miuffy-ol')} />;

function BlockRenderMapPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();
    hooks.createBlockRenderMap.tap('BlockRenderMapPlugin', () => {
      const newBlockRenderMap = Immutable.Map({
        'header-two': {
          element: 'h2',
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
          wrapper: <CodeBlock />,
        },

        unstyled: {
          element: 'div',
          wrapper: <NextDiv />,
        },
      });

      return DefaultDraftBlockRenderMap.merge(newBlockRenderMap);
    });
  };
}

export default BlockRenderMapPlugin;
