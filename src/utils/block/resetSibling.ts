import { ContentBlockNode } from '../../types';

export default (block: ContentBlockNode) => {
  return block.merge({
    prevSibling: null,
    nextSibling: null,
  });
};
