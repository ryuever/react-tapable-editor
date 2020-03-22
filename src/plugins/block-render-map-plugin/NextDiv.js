import React, { useCallback } from "react";
import classes from "classnames";
import "./nextDiv.css";

const NextDiv = props => {
  const { children } = props;
  const offsetKey = props["data-offset-key"];

  const cls = classes("next-div");
  console.log("props ", props);
  const mouseEnterHandler = useCallback(() => {}, []);

  return (
    <div className={cls} onMouseEnter={mouseEnterHandler}>
      {children}
    </div>
  );
};

export default NextDiv;
