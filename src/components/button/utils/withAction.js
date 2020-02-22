import React, { useCallback } from "react";

import "./action.css";

export default WrappedComponent => props => {
  const { onClick, ...rest } = props;
  const handleClick = useCallback(() => {
    if (typeof onClick === "function") onClick();
  });
  // 之所以要有这个handler，因为在点击`inlineToolbar`上的按钮时，它会清掉selection；
  // 有人发现是`onMouseDown`造成的问题；具体参考
  // https://github.com/facebook/draft-js/issues/696#issuecomment-302903086
  const onMouseDownHandler = useCallback(e => {
    e.preventDefault();
  }, []);

  return (
    <button
      onClick={handleClick}
      onMouseDown={onMouseDownHandler}
      className="icon-button icon-wrapper"
    >
      <WrappedComponent {...rest} />
    </button>
  );
};
