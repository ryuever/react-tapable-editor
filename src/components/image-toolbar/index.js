import React, { useCallback, useState, useEffect, useRef } from 'react';

import { withEditor } from '../../index';
import ImageAlignCenter from '../button/ImageAlignCenter';
import ImageAlignLeftFillContent from '../button/ImageAlignLeftFillContent';
import ImageAlignRightFillContent from '../button/ImageAlignRightFillContent';
import ImageAlignLeft from '../button/ImageAlignLeft';
import './styles.css';
import { EditorState, SelectionState } from 'draft-js';

const ImageAlignCenterButton = ({ activeKey, clickHandler, active }) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignCenter active={active} onClick={handleClick} />;
};

const ImageAlignLeftButton = ({ activeKey, clickHandler, active }) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignLeft active={active} onClick={handleClick} />;
};

const ImageAlignLeftFillContentButton = ({
  activeKey,
  clickHandler,
  active,
}) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignLeftFillContent active={active} onClick={handleClick} />;
};

const ImageAlignRightFillContentButton = ({
  activeKey,
  clickHandler,
  active,
}) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignRightFillContent active={active} onClick={handleClick} />;
};

const Toolbar = props => {
  const { forwardRef, getEditor } = props;
  const { hooks } = getEditor();
  const [alignment, setAlignment] = useState();
  const blockRef = useRef();

  const clickHandler = alignment => {
    const entityKey = blockRef.current.getEntityAt(0);
    if (entityKey) {
      const { editorState } = getEditor();
      const contentState = editorState.getCurrentContent();

      const resizeLayout = {};
      switch (alignment) {
        case 'center':
          resizeLayout.width = '900px';
          break;
        case 'right':
          resizeLayout.width = '450px';
          break;
        case 'left':
          resizeLayout.width = '450px';
          break;
        case 'leftFill':
          resizeLayout.width = '450px';
          break;
        case 'rightFill':
          resizeLayout.width = '450px';
          break;
      }

      // 设置alignment的同时，要设置resizeLayout;否则比如插入一个图片，然后resize图片，这个
      // 再点击alignment中的值的话，输入问题，它的width会变成刚刚resize时的值；
      const newContent = contentState.mergeEntityData(entityKey, {
        alignment,
        resizeLayout,
      });
      const nextState = EditorState.push(editorState, newContent);
      const newState = EditorState.forceSelection(
        nextState,
        nextState.getSelection()
      );
      const newContentState = newState.getCurrentContent();
      const blockMap = newContentState.getBlockMap();
      const lastBlock = newContentState.getLastBlock();
      const lastBlockText = lastBlock.getText();

      hooks.setState.call(newState, editorState => {
        const contentState = editorState.getCurrentContent();
        const entity = blockRef.current.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity);
        const type = entityState.getType();
        const data = entityState.getData();
        if (type === 'IMAGE') {
          const { alignment } = data;
          if (alignment) setAlignment(alignment);
        }
      });
    }
  };

  useEffect(() => {
    hooks.toggleImageToolbarVisible.tap('ImageToolbar', (visibility, block) => {
      if (visibility) {
        blockRef.current = block;
        const { editorState } = getEditor();
        const contentState = editorState.getCurrentContent();
        const entity = blockRef.current.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity);
        const type = entityState.getType();
        const data = entityState.getData();
        if (type === 'IMAGE') {
          const { alignment } = data;
          if (alignment) setAlignment(alignment);
        }
      }
    });
  }, [getEditor, hooks.toggleImageToolbarVisible]);

  return (
    <div className="image-toolbar" ref={forwardRef}>
      <div className="image-toolbar-inner">
        <div className="image-toolbar-action-group">
          {/* <ImageAlignLeftButton
            activeKey="left"
            active={alignment === "left"}
            clickHandler={clickHandler}
          /> */}
          <ImageAlignLeftFillContentButton
            activeKey="leftFill"
            active={alignment === 'leftFill'}
            clickHandler={clickHandler}
          />
          <ImageAlignCenterButton
            activeKey="center"
            active={alignment === 'center'}
            clickHandler={clickHandler}
          />
          <ImageAlignRightFillContentButton
            activeKey="rightFill"
            active={alignment === 'rightFill'}
            clickHandler={clickHandler}
          />
        </div>
      </div>
      <div className="arrow-down" />
    </div>
  );
};

export default withEditor(Toolbar);
