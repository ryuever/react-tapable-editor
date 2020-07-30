import React, { useState, useEffect, useRef, FC } from 'react';
import withEditor from '../../withEditor';
import ImageAlignCenter from '../button/ImageAlignCenter';
import ImageAlignLeftFillContent from '../button/ImageAlignLeftFillContent';
import ImageAlignRightFillContent from '../button/ImageAlignRightFillContent';
import { EditorState } from 'draft-js';

import {
  ImageAlignmentButtonFC,
  Alignment,
  ImageToolbarProps,
  ContentBlockNode,
  ResizeLayout,
} from '../../types';

import './styles.css';

const ImageAlignCenterButton: FC<ImageAlignmentButtonFC> = ({
  activeKey,
  clickHandler,
  active,
}) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignCenter active={active} onClick={handleClick} />;
};

const ImageAlignLeftFillContentButton: FC<ImageAlignmentButtonFC> = ({
  activeKey,
  clickHandler,
  active,
}) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignLeftFillContent active={active} onClick={handleClick} />;
};

const ImageAlignRightFillContentButton: FC<ImageAlignmentButtonFC> = ({
  activeKey,
  clickHandler,
  active,
}) => {
  const handleClick = () => clickHandler(activeKey);
  return <ImageAlignRightFillContent active={active} onClick={handleClick} />;
};

const ImageToolbar: FC<ImageToolbarProps> = props => {
  const { forwardRef, getEditor } = props;
  const { hooks } = getEditor();
  const [alignment, setAlignment] = useState();
  const blockRef = useRef<ContentBlockNode>();

  const clickHandler = (alignment: Alignment) => {
    const entityKey = blockRef.current!.getEntityAt(0);
    if (entityKey) {
      const { editorState } = getEditor();
      const contentState = editorState.getCurrentContent();

      const resizeLayout = {} as ResizeLayout;
      switch (alignment) {
        case Alignment.Center:
          resizeLayout.width = '900px';
          break;
        case Alignment.Right:
          resizeLayout.width = '450px';
          break;
        case Alignment.Left:
          resizeLayout.width = '450px';
          break;
        case Alignment.LeftFill:
          resizeLayout.width = '450px';
          break;
        case Alignment.RightFill:
          resizeLayout.width = '450px';
          break;
      }

      // 设置alignment的同时，要设置resizeLayout;否则比如插入一个图片，然后resize图片，这个
      // 再点击alignment中的值的话，输入问题，它的width会变成刚刚resize时的值；
      const newContent = contentState.mergeEntityData(entityKey, {
        alignment,
        resizeLayout,
      });
      const nextState = EditorState.push(
        editorState,
        newContent,
        'insert-fragment'
      );
      const newState = EditorState.forceSelection(
        nextState,
        nextState.getSelection()
      );

      hooks.setState.call(newState, (editorState: EditorState) => {
        const contentState = editorState.getCurrentContent();
        const entity = blockRef.current!.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity);
        const type = entityState.getType();
        const data = entityState.getData();
        if (type === 'IMAGE') {
          const { alignment } = data;
          if (alignment) setAlignment(alignment);
        }
        return null;
      });
    }
  };

  useEffect(() => {
    hooks.toggleImageToolbarVisible.tap('ImageToolbar', (visibility, block) => {
      if (visibility) {
        blockRef.current = block;
        const { editorState } = getEditor();
        const contentState = editorState.getCurrentContent();
        const entity = blockRef.current!.getEntityAt(0);
        if (!entity) return null;
        const entityState = contentState.getEntity(entity);
        const type = entityState.getType();
        const data = entityState.getData();
        if (type === 'IMAGE') {
          const { alignment } = data;
          if (alignment) setAlignment(alignment);
        }
      }
      return null;
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

export default withEditor(ImageToolbar);
