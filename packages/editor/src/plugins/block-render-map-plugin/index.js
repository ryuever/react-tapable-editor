import React from 'react'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import Immutable from 'immutable'
import classNames from 'classnames'
import CodeBlock from './CodeBlock'

const UL_WRAP = <ul className={classNames('miuffy-ul')} />;
const OL_WRAP = <ol className={classNames('miuffy-ol')} />;

function BlockRenderMapPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor()
    hooks.createBlockRenderMap.tap('BlockRenderMapPlugin', blockRenderMap => {
      const newBlockRenderMap = Immutable.Map({
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
          wrapper: <CodeBlock />,
        }
      });

      return DefaultDraftBlockRenderMap.merge(blockRenderMap, newBlockRenderMap)
    })
  }
}

export default BlockRenderMapPlugin