import React, { useState, useRef, useEffect, useCallback } from "react";
import Immutable from "immutable";
import { withEditor } from "../../index";
import "./styles.css";
import StyleControls from "./StyleControls";
import InputBar from "./InputBar";

import getSelectionBlockTypes from "../../utils/getSelectionBlockTypes";
import getInlineToolbarInlineInfo from "../../utils/getInlineToolbarInlineInfo";

const InlineToolbar = props => {
  const { forwardRef, getEditor } = props;
  const [value, setValue] = useState({
    styles: new Immutable.OrderedSet(),
    blockTypes: [],
    inDisplayMode: true,
    hasLink: false
  });
  const inDisplayModeRef = useRef(true);

  useEffect(() => {
    const { hooks } = getEditor();
    hooks.inlineBarChange.tap("InlineToolbar", (editorState, visibility) => {
      const nextValue = {
        inDisplayMode: visibility === "hidden" ? true : inDisplayModeRef.current
      };

      if (editorState) {
        const { styles, hasLink } = getInlineToolbarInlineInfo(editorState);
        nextValue.styles = styles;
        nextValue.hasLink = hasLink;
        nextValue.blockTypes = getSelectionBlockTypes(editorState);
      } else {
        nextValue.styles = new Immutable.OrderedSet();
        nextValue.blockTypes = [];
        nextValue.hasLink = false;
      }

      inDisplayModeRef.current = nextValue.inDisplayMode;

      setValue(nextValue);
    });
  }, []);

  const toggleDisplayMode = useCallback(() => {
    setValue({
      ...value,
      inDisplayMode: !inDisplayMode
    });
    inDisplayModeRef.current = !inDisplayMode;
  }, [inDisplayMode]);

  const { styles, blockTypes, inDisplayMode, hasLink } = value;

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

const MemoToolbar = React.memo(
  props => {
    return <InlineToolbar {...props} />;
  },
  () => true
);

export default withEditor(MemoToolbar);
