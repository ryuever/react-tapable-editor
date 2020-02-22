import React, { useRef, useEffect, useCallback } from "react";
import { EditorState } from "draft-js";
import Divider from "./Divider";

import Link from "../button/Link";
import Unlink from "../button/Unlink";

import { createLinkAtSelection } from "../../utils/createEntity";

const InputBar = ({ getEditor }) => {
  const inputRef = useRef();
  const { hooks } = getEditor();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const submit = value => {
    const { editorState, hooks } = getEditor();
    const newState = createLinkAtSelection(editorState, value);
    const currentContent = newState.getCurrentContent();
    const selection = newState.getSelection();
    const focusOffset = selection.getFocusOffset();
    const focusKey = selection.getFocusKey();

    // 通过下面的方式，并不能够将cursor放置在刚刚的selection末尾
    // const nextState = EditorState.set(newState, {
    //   currentContent: currentContent.merge({
    //     selectionAfter: currentContent.getSelectionAfter().merge({
    //       hasFocus: true,
    //       anchorOffset: focusOffset,
    //       anchorKey: focusKey,
    //     })
    //   })
    // })
    // hooks.setState.call(nextState)

    // 当用户输入完以后，指针是放置在selection的后面
    const nextState = EditorState.forceSelection(
      newState,
      currentContent.getSelectionAfter().merge({
        anchorOffset: focusOffset,
        anchorKey: focusKey
      })
    );

    hooks.setState.call(nextState);
  };

  const onKeyDownHandler = useCallback(e => {
    const { key } = e;
    if (key === "Enter") {
      hooks.cleanUpLinkClickState.call();
      e.preventDefault();
      const inputValue = e.target.value;
      submit(inputValue);
      hooks.hideInlineToolbar.call();
    } else if (key === "Escape") {
      e.preventDefault();
      hooks.hideInlineToolbar.call();
    }
  }, []);

  return (
    <div className="inline-toolbar-link-inner">
      <input
        ref={inputRef}
        className="inline-link-input"
        placeholder="Paste your link, such as http://google.com..."
        onKeyDown={onKeyDownHandler}
      />
      <Divider />
      <div className="link-action-group">
        <Link active={false} />
        <Unlink active={false} />
      </div>
    </div>
  );
};

export default InputBar;
