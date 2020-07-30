// @ts-ignore
import generateRandomKey from 'draft-js/lib/generateRandomKey';
// @ts-ignore
import ContentBlockNode from 'draft-js/lib/ContentBlockNode';
import { Map, List } from 'immutable';
import { ContentBlockNode as ContentBlockNodeType } from '../../types';

export default () => {
  const blockKey = generateRandomKey();
  return new ContentBlockNode({
    key: blockKey,
    text: '',
    data: Map(),
    children: List(),
    type: 'unstyled',
  }) as ContentBlockNodeType;
};
