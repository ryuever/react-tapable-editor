import React, { useState, useRef, useEffect, useCallback, FC } from 'react';
import Immutable from 'immutable';
import withEditor from '../../withEditor';
import StyleControls from './StyleControls';
import InputBar from './InputBar';
import getSelectionBlockTypes from '../../utils/getSelectionBlockTypes';
import getInlineToolbarInlineInfo from '../../utils/getInlineToolbarInlineInfo';
import { InlineToolbarProps, InlineToolbarStateValues } from '../../types';

import './styles.css';

const InlineToolbar: FC<InlineToolbarProps> = props => {
  const { forwardRef, getEditor } = props;
  const [value, setValue] = useState({
    styles: Immutable.OrderedSet(),
    blockTypes: [],
    inDisplayMode: true,
    hasLink: false,
  } as InlineToolbarStateValues);
  const inDisplayModeRef = useRef(true);

  useEffect(() => {
    const { hooks } = getEditor();
    hooks.inlineBarChange.tap('InlineToolbar', (editorState, visibility) => {
      const nextValue = {
        inDisplayMode:
          visibility === 'hidden' ? true : inDisplayModeRef.current,
      } as InlineToolbarStateValues;

      if (editorState) {
        const { styles, hasLink } = getInlineToolbarInlineInfo(editorState);
        if (styles) {
          nextValue.styles = styles as any;
        }
        nextValue.hasLink = hasLink;
        nextValue.blockTypes = getSelectionBlockTypes(editorState);
      } else {
        nextValue.styles = Immutable.OrderedSet();
        nextValue.blockTypes = [];
        nextValue.hasLink = false;
      }

      inDisplayModeRef.current = nextValue.inDisplayMode;

      setValue(nextValue);
    });
  }, [getEditor]);

  const { styles, blockTypes, inDisplayMode, hasLink } = value;

  const toggleDisplayMode = useCallback(() => {
    setValue({
      ...value,
      inDisplayMode: !inDisplayMode,
    });
    inDisplayModeRef.current = !inDisplayMode;
  }, [inDisplayMode, value]);

  return (
    <div className="inline-toolbar" ref={forwardRef}>
      {inDisplayMode && (
        <StyleControls
          styles={styles}
          hasLink={hasLink}
          blockTypes={blockTypes}
          getEditor={getEditor}
          toggleDisplayMode={toggleDisplayMode}
        />
      )}
      {!inDisplayMode && <InputBar getEditor={getEditor} />}
      <div className="arrow-down" />
    </div>
  );
};

const MemoToolbar = React.memo<InlineToolbarProps>(
  props => {
    return <InlineToolbar {...props} />;
  },
  () => true
);

export default withEditor(MemoToolbar);
