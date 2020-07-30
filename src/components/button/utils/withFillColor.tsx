import React, { ComponentType } from 'react';

import {
  ButtonProps,
  WithFillColorProps,
  WithActionProps,
} from '../../../types';

export default <
  Props extends WithFillColorProps & WithActionProps & ButtonProps
>(
  WrappedComponent: ComponentType<Omit<Props, 'active'>>
): ComponentType<Omit<Props, 'fill'>> =>
  // memo(
  (props: Omit<Props, 'fill'>) => {
    const { active, ...rest } = props;
    const fill = active ? '#34e79a' : '#fff';

    return (
      <WrappedComponent {...(rest as Omit<Props, 'active'>)} fill={fill} />
    );
  };
//   (next: Omit<Props, 'fill'>, prev: Omit<Props, 'fill'>) => next.active === prev.active
// );
