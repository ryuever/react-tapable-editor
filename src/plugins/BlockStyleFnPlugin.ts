import classes from 'classnames';
import { GetEditor } from '../types';
import './blockStyleFnPlugin.css';

function BlockStyleFnPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();
    hooks.blockStyleFn.tap('BlockStyleFnPlugin', (...props) => {
      const block = props[0];
      const cls = [];
      const blockData = block.getData();
      const depth = blockData.get('depth') || 0;

      const isDataWrapper = blockData.get('data-wrapper');
      const dataDirection = blockData.get('data-direction');

      if (block.getChildKeys().size && isDataWrapper) {
        cls.push(`data-wrapper-${dataDirection}`);
      }

      cls.push(`block-level-${depth}`);

      switch (block.getType()) {
        // 控制比如说，最后渲染出来的引用，它的class是
        case 'blockquote':
          cls.push('miuffy-blockquote');
          break;
        case 'unstyled':
          cls.push('miuffy-paragraph');
          break;
        case 'unordered-list-item':
          cls.push('miuffy-unordered-list-item');
          break;
        case 'atomic':
          const { editorState } = getEditor();
          const contentState = editorState.getCurrentContent();
          const entity = block.getEntityAt(0);
          if (!entity) return null;
          const entityState = contentState.getEntity(entity);
          const type = entityState.getType();
          const data = entityState.getData();
          if (type === 'IMAGE') {
            const { alignment } = data;

            switch (alignment) {
              case 'center':
                cls.push('figure-image-center');
                break;
              case 'right':
                cls.push('figure-image-right');
                break;
              case 'left':
                cls.push('figure-image-left');
                break;
              case 'leftFill':
                cls.push('figure-image-left-fill');
                break;
              case 'rightFill':
                cls.push('figure-image-right-fill');
                break;
              default:
                cls.push('figure-image');
            }
          }
          break;
        default:
        // ...
      }
      return classes(cls);
    });
  };
}

export default BlockStyleFnPlugin;
