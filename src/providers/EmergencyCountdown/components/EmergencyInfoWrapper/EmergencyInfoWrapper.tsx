import React, {FC, ReactNode} from 'react';
import {Box} from 'native-base';

interface IEmergencyInfoWrapper {
  children: ReactNode;
  color: string;
}

export const EmergencyInfoWrapper: FC<IEmergencyInfoWrapper> = ({
  children,
  color,
}) => {
  return (
    <Box
      position={'absolute'}
      width={'100%'}
      height={'100%'}
      backgroundColor={color}
      justifyContent={'center'}>
      {children}
    </Box>
  );
};

export default EmergencyInfoWrapper;
