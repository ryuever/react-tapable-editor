import React, { useRef } from "react";
import "./styles/index.css";
import useFocus from "../../hooks/useFocus";
import useResize from "../../hooks/useResize";

const Image = props => {
  const { block, contentState } = props;
  console.log("create ref ");
  const ref = useRef();
  useFocus({ nodeRef: ref, props });
  useResize({ nodeRef: ref, props });

  const meta = contentState.getEntity(block.getEntityAt(0)).getData();
  const { src } = meta;

  return (
    <div className="image-wrapper" ref={ref}>
      <img src={src} className="image" />
    </div>
  );
};

export default Image;
