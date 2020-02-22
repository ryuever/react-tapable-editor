import React from "react";
import withAction from "./utils/withAction";

const Plus = () => {
  return (
    <svg viewBox="0 0 18 18" width="14" height="14" fill="inherit">
      <polygon points="17,8 10,8 10,1 8,1 8,8 1,8 1,10 8,10 8,17 10,17 10,10 17,10 "></polygon>
    </svg>
  );
};

export default withAction(Plus);
