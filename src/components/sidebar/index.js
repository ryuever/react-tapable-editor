import React, { useRef } from "react";
import classes from "classnames";
import Plus from "../button/Plus";
import Dragger from "../button/Dragger";
import "./styles.css";

const Sidebar = props => {
  const { forwardRef } = props;
  const containerStyleRef = useRef(classes("container"));
  return (
    <div className={containerStyleRef.current} ref={forwardRef}>
      <div className="plus">
        <Plus />
      </div>
      <div className="dragger">
        <Dragger />
      </div>
    </div>
  );
};

export default Sidebar;
