import React, { useContext, ComponentType, FC } from 'react';
import Context from './Context';
import { ReturnProps, GetEditor, IWrappedComponent } from './types';

function getDisplayName<T>(
  WrappedComponent: ComponentType<IWrappedComponent<T>>
) {
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'WithEditorComponent'
  );
}

// ts-hint: refer to https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
// and take note on `Subtract` method...
function withEditor<T>(
  // ts-hint: according to WrappedComponent type. it will implicate the generic type
  // of `T` which exclude `getEditor` props
  WrappedComponent: ComponentType<IWrappedComponent<T>>
): FC<ReturnProps<T>> {
  return (props: T) => {
    WrappedComponent.displayName = `WrappedComponent(${getDisplayName(
      WrappedComponent
    )})`;
    const getEditor = useContext<GetEditor | null>(Context) as GetEditor;
    return <WrappedComponent {...props} getEditor={getEditor} />;
  };
}

export default withEditor;
