import React, { useContext } from 'react'
import Context from './Context'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'WithEditorComponent';
}

export default WrappedComponent => props => {
  WrappedComponent.displayName = `WrappedComponent(${getDisplayName(WrappedComponent)})`;

  const getEditor = useContext(Context)

  return (
    <WrappedComponent
      {...props}
      getEditor={getEditor}
    />
  )
}