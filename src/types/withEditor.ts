import { ReactNode } from 'react';

// export type UnknownProps<T> = {
//   [P in keyof T]: T[P];
// } & {
//   children?: ReactChild;
//   getEditor: object;
// };

// export interface ReturnProps<T> {
//   children?: ReactChild;
//   getEditor: object;
//   (key: keyof T): T[keyof T];
// }

export type ReturnProps<T> = {
  [P in keyof T]: T[P];
} & {
  children?: ReactNode;
  // getEditor: object;
};
