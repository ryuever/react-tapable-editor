import React, { useCallback, createRef } from "react";
// import classes from "classnames";
import "./nextDiv.css";
// import useFocus from '../../hooks/useFocus'

const NextDiv = props => {
  const { children } = props;
  const ref = createRef();
  // useFocus(ref)
  // const cls = classes("next-div");
  // const mouseEnterHandler = useCallback(() => {}, []);
  return <>{children}</>;

  // will cause drag and drop block not work...
  // return (
  //   <div ref={ref}>
  //     {children}
  //   </div>
  // );
};

export default NextDiv;
