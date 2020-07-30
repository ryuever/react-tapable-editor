import { ReactNode } from 'react';
import { GetEditor } from './';

export type ReturnProps<T> = {
  // ts-hint: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#mapped-types
  // ts-hint: https://www.typescriptlang.org/docs/handbook/advanced-types.html keyof....
  [P in keyof T]: T[P];
} & {
  children?: ReactNode;
};

export type IWrappedComponent<T> = ReturnProps<T> & {
  getEditor: GetEditor;
};
