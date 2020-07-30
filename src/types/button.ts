import { ReactChild } from 'react';

export interface WithActionProps {
  onClick: Function;
}

export interface WithFillColorProps {
  active: boolean;
}

export interface ButtonProps {
  children?: ReactChild;
  fill: string;
}

export type IWithActionProps<T> = {
  [P in keyof T]: T[P];
};
