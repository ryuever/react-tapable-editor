import { GetEditor, BlockNodeMap } from '../types';
import { EditorState } from 'draft-js';

/**
 * depth is used for `blockStyleFnPlugin`
 */
const UpdateBlockDepthData = function() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();
    hooks.updateBlockDepthData.tap(
      'updateBlockDepthData',
      (editorState: EditorState) => {
        const currentState = editorState.getCurrentContent();
        const blockMap = currentState.getBlockMap() as BlockNodeMap;
        const selectionState = editorState.getSelection();
        const depthMap = Object.create(null);
        blockMap.toSeq().forEach(block => {
          const key = block.getKey();
          const parentKey = block.getParentKey();
          depthMap[key] = {
            directParent: parentKey,
            parents: [],
            depth: 0,
          };
        });

        for (let key in depthMap) {
          const value = depthMap[key];
          let parent = value.directParent;

          while (parent) {
            value.parents.push(parent);
            parent = depthMap[parent].directParent;
          }

          value.depth = value.parents.length;
        }

        const newBlocks = blockMap
          .toSeq()
          .map(block => {
            const data = block.getData();
            const key = block.getKey();
            const newDepth = depthMap[key].depth;
            const oldDepth = data.get('depth');
            if (newDepth === oldDepth) return block;
            return block.merge({
              data: data.merge({ depth: depthMap[key].depth }),
            });
          })
          .toOrderedMap();

        // refer to https://github.com/facebook/draft-js/blob/master/src/model/transaction/modifyBlockForContentState.js#L37
        const newContent = (currentState as any).merge({
          blockMap: newBlocks,
          selectionBefore: selectionState,
          selectionAfter: selectionState,
        });

        // TODO: why selection
        // The following code will cause selection issues...

        // const newBlockMap = blockMap.toSeq().map(block => {
        //   const data = block.getData();
        //   const key = block.getKey();
        //   const newDepth = depthMap[key].depth;
        //   const oldDepth = data.get('depth');
        //   if (newDepth === oldDepth) return block;

        //   return block.merge({
        //     data: data.merge({ depth: depthMap[key].depth }),
        //   });
        // }).toOrderedMap();

        // // Note: set ``
        // const newContent = (currentState as any).set('blockMap', newBlockMap);

        return EditorState.push(editorState, newContent, 'change-block-data');
      }
    );
  };
};

export default UpdateBlockDepthData;
