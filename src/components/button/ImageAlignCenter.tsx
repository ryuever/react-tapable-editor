import React, { ComponentType } from 'react';
import withFillColor from './utils/withFillColor';
import withAction from './utils/withAction';
import { ButtonProps } from '../../types';

const ImageAlignCenter: ComponentType<ButtonProps> = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <path d="M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M5,7 L5,17 L19,17 L19,7 L5,7 Z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
};

// export default withAction(ImageAlignCenter)
export default withFillColor(withAction(ImageAlignCenter));

// interface FooProps {
//   foo: string;
// }

// interface BarProps {
//   bar: string;
// }

// export const withFoo = <Props extends FooProps>(
//   Component: React.ComponentType<Props>
// ): React.ComponentType<Omit<Props, keyof FooProps>> => props => (
//   <Component {...props as Props} foo="foo" />
// );

// export const withBar = <Props extends BarProps>(
//   Component: React.ComponentType<Props>
// ): React.ComponentType<Omit<Props, keyof BarProps>> => props => (
//   <Component {...props as Props} bar="bar" />
// );

// const WrappedComponent = ({ bar, foo, more }) => {
//   console.log(more);
//   console.log(bar);
//   console.log(foo);
//   return <div>woohoo</div>;
// };

// const EnhancedComponent = withFoo(withBar(WrappedComponent));
