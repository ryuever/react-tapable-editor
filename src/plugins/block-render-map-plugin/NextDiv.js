import React, { useCallback } from "react";
import classes from "classnames";
import "./nextDiv.css";

const NextDiv = props => {
  const { children } = props;

  const cls = classes("next-div");
  const mouseEnterHandler = useCallback(() => {}, []);

  return (
    <div className={cls} onMouseEnter={mouseEnterHandler}>
      {children}
    </div>
  );
};

export default NextDiv;
