import React, { useState, FC, useEffect, useRef, RefObject } from 'react';
import './styles/index.css';
import useFocus from '../../hooks/useFocus';
import useResize from '../../hooks/useResize';
import useAlignment from '../../hooks/useAlignment';
import { ImageProps } from '../../types';

const Image: FC<ImageProps> = props => {
  // createRef does not work. Because the `nodeRef` value is not updated
  // even if after useEffect triggered.
  const ref = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
  const [, setIsRefReady] = useState(false);

  useEffect(() => {
    setIsRefReady(true);
  }, []);

  const { block, contentState } = props;
  useFocus({ nodeRef: ref, props });
  useResize({ nodeRef: ref, props });
  useAlignment({ nodeRef: ref, props });

  const meta = contentState.getEntity(block.getEntityAt(0)).getData();
  const { src } = meta;

  return (
    <div className="image-wrapper" ref={ref}>
      <img src={src} className="image" alt="wrapper" />
    </div>
  );
};

export default Image;
