// // 主要是为了解决在`isInCompositionMode`模式下，进行`inlineStyle`切换的时候，会出现
// // 刚刚触发的`inlineStyle`变化并不会作用到接下来的输入的问题。目前的处理方式就是在
// // toggle inline style以及换行的时候，默认添加一个`\u200B`字符
// import { Modifier, EditorState, SelectionState } from 'draft-js';
// import { splitAtLastCharacterAndForwardSelection } from '../utils/editorState';
// import { GetState } from '../types'

// function StyleControlPlugin() {
//   const selectionWithNonWidthCharacter = {};

//   this.apply = (getState: GetState) => {
//     const { hooks } = getState();

//     // 1. 首先判断是在`isCollapsed`模式下
//     // 2. 查看触发`inlineStyle`变化位置的前一个字符是否是`\u200B`，如果是的话，就将新的
//     //    inlineStyle应用到它上面，否则就插入一个`\u200B`字符
//     hooks.afterInlineStyleApplied.tap(
//       'StyleControlPlugin',
//       (newEditorState, editorState, inlineStyle) => {
//         const nextEditorState = newEditorState || editorState;
//         const currentContent = nextEditorState.getCurrentContent();
//         const selection = nextEditorState.getSelection();
//         const currentInlineStyle = nextEditorState.getCurrentInlineStyle();
//         if (selection.isCollapsed()) {
//           const startKey = selection.getStartKey();
//           const anchorOffset = selection.getAnchorOffset();
//           const block = currentContent.getBlockForKey(startKey);

//           // 查看一下最后的字符是否是`\u200B`;如果是的话，则直接将它替换掉，而不是再添加一个
//           const len = block.getLength();
//           const text = block.getText();
//           const lastCharacter = text[len - 1];
//           let newCurrentState;
//           let action;
//           let markerSelection;

//           if (lastCharacter === '\u200B') {
//             markerSelection = selection.merge({
//               anchorOffset: len - 1,
//               focusOffset: len,
//             });
//             newCurrentState = Modifier.applyInlineStyle(
//               currentContent,
//               markerSelection,
//               inlineStyle
//             );
//             action = 'change-inline-style';
//           } else {
//             markerSelection = selection;
//             newCurrentState = Modifier.insertText(
//               currentContent,
//               selection,
//               '\u200B',
//               currentInlineStyle,
//               null
//             );
//             action = 'insert-characters';

//             if (!selectionWithNonWidthCharacter[startKey])
//               selectionWithNonWidthCharacter[startKey] = {};
//             const group = selectionWithNonWidthCharacter[startKey];
//             group[anchorOffset] = selection;
//           }

//           const next = EditorState.push(
//             nextEditorState,
//             newCurrentState,
//             action
//           );
//           // 如果不设置forceSelection的话，当触发`inlineStyle`改变的时候，光标并不会被
//           // 放置到新插入的`\u200B`的后面；如果不进行`forceSelection`的话，只能够是通过光标移动来解决了
//           return EditorState.forceSelection(
//             next,
//             newCurrentState.getSelectionAfter()
//           );
//         }
//         return null;
//       }
//     );

//     // 存在的问题，新开一个editor，然后只是敲入几行空格，最后再`backspace`删除直到第一行的时候
//     // 切换成中文输入法然后输入东西会报错；
//     // 1. 当进行换行的时候，需要判断最后一个字符是否是`\u200B`；如果是的话，在该字符的前面进行中断；
//     // 2. 如果不是，就要看最后一个字符是否有inlineStyle，如果有就插入一个新的`\u200B`；没有就不做
//     // 处理
//     hooks.handleKeyCommand.tap('StyleControlPlugin', (command, editorState) => {
//       const selection = editorState.getSelection();
//       const currentContent = editorState.getCurrentContent();
//       const endKey = selection.getEndKey();
//       const block = currentContent.getBlockForKey(endKey);
//       const blockSize = block.getLength();
//       const text = block.getText();

//       if (!selection.isCollapsed()) return 'not-handled';

//       if (command === 'split-block') {
//         if (text) {
//           const charAtLast = block.getText()[blockSize - 1];
//           if (charAtLast === '\u200B') {
//             const newState = splitAtLastCharacterAndForwardSelection(
//               editorState
//             );

//             delete selectionWithNonWidthCharacter[endKey][blockSize - 1];
//             const afterBlock = newState
//               .getCurrentContent()
//               .getBlockAfter(endKey);
//             const afterSelection = newState.getSelection();
//             const afterBlockKey = afterBlock.getKey();
//             if (!selectionWithNonWidthCharacter[afterBlockKey]) {
//               selectionWithNonWidthCharacter[afterBlockKey] = {};
//             }
//             const group = selectionWithNonWidthCharacter[afterBlockKey];
//             group[0] = afterSelection.merge({
//               anchorOffset: 0,
//               focusOffset: 0,
//             });

//             hooks.setState.call(newState);
//             return 'handled';
//           }
//         }

//         const currentStyle = block.getInlineStyleAt(blockSize - 1);
//         if (currentStyle.size) {
//           // Modifier.insertText其实是有`selection`的变化的
//           const nextContent = Modifier.insertText(
//             currentContent,
//             selection,
//             '\u200B',
//             currentStyle,
//             null
//           );
//           const newEditorState = EditorState.push(editorState, nextContent);
//           const newState = splitAtLastCharacterAndForwardSelection(
//             newEditorState
//           );

//           // 删除因为split造成的行头存在的`\u200B`字符
//           const afterBlock = newState.getCurrentContent().getBlockAfter(endKey);
//           const afterSelection = newState.getSelection();
//           const afterBlockKey = afterBlock.getKey();
//           if (!selectionWithNonWidthCharacter[afterBlockKey]) {
//             selectionWithNonWidthCharacter[afterBlockKey] = {};
//           }
//           const group = selectionWithNonWidthCharacter[afterBlockKey];
//           group[0] = afterSelection.merge({
//             anchorOffset: 0,
//             focusOffset: 0,
//           });

//           hooks.setState.call(newState);
//           return 'handled';
//         }
//       }
//     });

//     hooks.didUpdate.tap('RemoveLastNonWidthCharacterPlugin', editorState => {
//       // return
//       const selection = editorState.getSelection();
//       const currentState = editorState.getCurrentContent();
//       const isInCompositionMode = editorState.isInCompositionMode();

//       if (selection.isCollapsed() && !isInCompositionMode) {
//         const currentSelectionPosition = selection.getAnchorOffset();
//         const currentStartKey = selection.getStartKey();
//         const group = selectionWithNonWidthCharacter[currentStartKey];
//         if (group) {
//           const keys = Object.keys(group);

//           const newState = keys.reduce((es, key) => {
//             const markerSelection = group[key];
//             const content = es.getCurrentContent();
//             const block = content.getBlockForKey(markerSelection.getStartKey());
//             const blockText = block.getText();
//             const markerSelectionPosition = markerSelection.getAnchorOffset();
//             if (
//               Math.abs(markerSelectionPosition - currentSelectionPosition) <= 1
//             )
//               return es;

//             delete group[key];

//             // TODO：这里是一个比较粗糙的判断，如果说当前的位置还是一个空字符的话，那就处理，否则
//             // 就不处理；其实本身通过`selectionWithNonWidthCharacter`来进行记录其实都不是一个
//             // 合理的方案，会出现很多的不一致的情况，比如说在行首，触发了inlineStyle这个时候马上删除
//             // 你接下来输入的字符第一个会被删除掉。。。因为 selectionWithNonWidthCharacter还标记
//             // 着行首是一个空字符。。。
//             if (blockText[markerSelectionPosition] !== '\u200B') return;

//             const newContent = Modifier.removeRange(
//               content,
//               markerSelection.merge({
//                 focusOffset: markerSelectionPosition + 1,
//               }),
//               'backward'
//             );

//             // 通过设置新的`selectionAfter`为了解决，当比如中文输入完以后，光标应该回到哪个位置；
//             // 如果没有这个的设置的话，光标会被放置到刚刚输入中文开始的位置。
//             // const newState = EditorState.push(editorState, newContent, 'delete-character')
//             const newState = EditorState.push(
//               editorState,
//               newContent.set(
//                 'selectionAfter',
//                 new SelectionState({
//                   anchorKey: currentStartKey,
//                   anchorOffset: selection.getAnchorOffset() - 1,
//                   focusKey: currentStartKey,
//                   focusOffset: selection.getAnchorOffset() - 1,
//                   isBackward: false,
//                   hasFocus: true,
//                 })
//               ),
//               'delete-character'
//             );

//             return newState;
//             // const newState = EditorState.push(editorState, newContent.set('selectionAfter', selection), 'delete-character')
//             // return EditorState.forceSelection(newState, es.getSelection())
//           }, editorState);

//           if (newState && newState !== editorState)
//             hooks.setState.call(newState);
//         }
//       }
//     });
//   };
// }

// export default StyleControlPlugin;
