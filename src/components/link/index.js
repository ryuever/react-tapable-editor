import React from 'react';
import './styles.css';

const Link = props => {
  const { contentState, entityKey, children } = props;
  const entity = contentState.getEntity(entityKey);
  const data = entity.get('data');
  const { url } = data;

  return (
    <a className="decorator_link" href={url} target="_blank">
      {props.children}
    </a>
  );
};

export default Link;
