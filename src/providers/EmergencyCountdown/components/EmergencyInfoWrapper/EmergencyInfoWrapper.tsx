import React, {FC, ReactNode} from 'react';
import {Box} from 'native-base';

interface IEmergencyInfoWrapper {
  children: ReactNode;
  colors: [string, string];
  marginTop: string;
  marginHorizontal: number;
  roundedTopCorners: boolean;
  roundedBottomCorners: boolean;
  paddingBottom: string;
}

export const EmergencyInfoWrapper: FC<IEmergencyInfoWrapper> = ({
  children,
  colors,
  marginTop,
  marginHorizontal,
  roundedTopCorners,
  roundedBottomCorners,
  paddingBottom,
}) => {
  return (
    <>
      <Box
        position="absolute"
        top={marginTop}
        bottom={0}
        left={marginHorizontal}
        right={marginHorizontal}
        justifyContent="flex-end">
        <Box
          p={3}
          bg={{
            linearGradient: {
              colors: colors,
              start: [0, 0],
              end: [0, 1],
            },
          }}
          borderTopRadius={roundedTopCorners ? 20 : 0}
          borderBottomRadius={roundedBottomCorners ? 20 : 0}
          justifyContent={paddingBottom ? 'flex-end' : 'center'}
          alignItems="center"
          height="100%"
          width="100%"
        />
      </Box>
      <Box
        position="absolute"
        bottom={paddingBottom}
        left={0}
        right={0}
        flex={1}>
        {children}
      </Box>
    </>
  );
};

export default EmergencyInfoWrapper;
