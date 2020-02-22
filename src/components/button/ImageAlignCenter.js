import React from "react";
import withFillColor from "./utils/withFillColor";
import withAction from "./utils/withAction";

const ImageAlignCenter = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <path d="M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M5,7 L5,17 L19,17 L19,7 L5,7 Z"></path>
      <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
  );
};

export default withFillColor(withAction(ImageAlignCenter));
