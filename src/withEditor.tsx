import React, { useContext, ComponentType, FC } from 'react';
import Context from './Context';
import { ReturnProps, GetEditor } from './types';

function getDisplayName<T>(
  WrappedComponent: ComponentType<
    ReturnProps<T> & {
      getEditor: GetEditor;
    }
  >
) {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'WithEditorComponent'
  );
}

// interface Props {
//   children?: ReactChild;
// }

function withEditor<T>(
  WrappedComponent: ComponentType<
    ReturnProps<T> & {
      getEditor: GetEditor;
    }
  >
): FC<ReturnProps<T>> {
  return (props: T) => {
    WrappedComponent.displayName = `WrappedComponent(${getDisplayName(
      WrappedComponent
    )})`; // eslint-disable-line

    const getEditor = useContext(Context) as GetEditor;

    return <WrappedComponent {...props} getEditor={getEditor} />;
  };
}

export default withEditor;

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
