import React, { FC } from 'react';
import { LinkProps } from '../../types';
import './styles.css';

const Link: FC<LinkProps> = (props: LinkProps) => {
  const { contentState, entityKey, children } = props;
  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();
  const { url } = data;

  return (
    <a className="decorator_link" href={url} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default Link;
