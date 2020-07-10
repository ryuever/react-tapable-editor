import React, { useContext, ComponentType, ReactChild, FC } from 'react';
import Context from './Context';
import { ReturnProps } from './types';

function getDisplayName(WrappedComponent: ComponentType<ReturnProps>) {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'WithEditorComponent'
  );
}

interface Props {
  children?: ReactChild;
}

export default (
  WrappedComponent: ComponentType<ReturnProps>
): FC<ReturnProps> => (props: Props) => {
  WrappedComponent.displayName = `WrappedComponent(${getDisplayName(
    WrappedComponent
  )})`; // eslint-disable-line

  const getEditor = useContext(Context);

  return <WrappedComponent {...props} getEditor={getEditor} />;
};

// export default (WrappedComponent: ComponentType<ReturnProps>) => {
//   const Next: FC<ReturnProps> = (props: Props) => {
//     WrappedComponent.displayName = `WrappedComponent(${getDisplayName(
//       WrappedComponent
//     )})`; // eslint-disable-line

//     const getEditor = useContext(Context);

//     return <WrappedComponent {...props} getEditor={getEditor} />;
//   };

//   return Next
// }
