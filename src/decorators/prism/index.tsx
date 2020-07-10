// https://github.com/SamyPesse/draft-js-prism/blob/master/lib/index.js
import React, { FC, ReactChild } from 'react';
import Immutable from 'immutable';
import { ContentBlock } from 'draft-js';
import Prism, { Token } from 'prismjs';

interface PrismDecoratorType {
  highlighted: object;
}

interface Props {
  children: ReactChild;
  type: string;
}

function PrismDecorator(this: PrismDecoratorType) {
  this.highlighted = {};
}

/**
 * Return list of decoration IDs per character
 *
 * @param {ContentBlock}
 * @return {List<String>}
 */
PrismDecorator.prototype.getDecorations = function(block: ContentBlock) {
  let tokens;
  let token;
  let tokenId;
  let resultId;
  let offset = 0;
  let tokenCount = 0;
  const blockKey = block.getKey();
  const blockType = block.getType();
  const blockData = block.getData();
  const blockText = block.getText();
  const decorations = Array(blockText.length).fill(null);
  const { highlighted } = this;

  highlighted[blockKey] = {};

  if (blockType !== 'code-block') {
    return Immutable.List(decorations);
  }

  const syntax = blockData.get('syntax') || 'javascript';

  // Allow for no syntax highlighting
  if (syntax == null) {
    return Immutable.List(decorations);
  }

  // Parse text using Prism
  const grammar = Prism.languages[syntax];
  tokens = Prism.tokenize(blockText, grammar) as string[] | Token[];

  function processToken(
    decorations: string[],
    token: string | Token,
    offset: number
  ) {
    if (typeof token === 'string') {
      return;
    }
    // First write this tokens full length
    tokenId = `tok${tokenCount++}`;
    resultId = `${blockKey}-${tokenId}`;
    highlighted[blockKey][tokenId] = token;
    occupySlice(decorations, offset, offset + token.length, resultId);
    // Then recurse through the child tokens, overwriting the parent
    let childOffset = offset;
    if (Array.isArray(token.content)) {
      const content = token.content as Token[];
      for (let i = 0; i < content.length; i++) {
        const childToken = content[i] as Token;
        processToken(decorations, childToken, childOffset);
        childOffset += childToken.length;
      }
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i];
    processToken(decorations, token, offset);
    offset += token.length;
  }

  return Immutable.List(decorations);
};

/**
 * Return component to render a decoration
 *
 * @param {String}
 * @return {Function}
 */
PrismDecorator.prototype.getComponentForKey = function() {
  const Component: FC<Props> = props => {
    const { type, children } = props;
    const className = `prism-token token ${type}`;
    return <span className={className}>{children}</span>;
  };
  return Component;
};

/**
 * Return props to render a decoration
 *
 * @param {String}
 * @return {Object}
 */
PrismDecorator.prototype.getPropsForKey = function(key: string) {
  const parts = key.split('-');
  const blockKey = parts[0];
  const tokId = parts[1];
  const token = this.highlighted[blockKey][tokId];

  return {
    type: token.type,
  };
};

function occupySlice(
  targetArr: string[],
  start: number,
  end: number,
  componentKey: string
) {
  for (let ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}

export default PrismDecorator;
