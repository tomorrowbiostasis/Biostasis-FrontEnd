import * as React from 'react';
import {SvgProps} from 'react-native-svg';
import {BioWelcomeScreenShield} from '~/assets/icons/BiostasisIcons';

const SetupCompleteShield: React.FC<SvgProps> = ({
  width = 36,
  height = 38,
  ...props
}) => <BioWelcomeScreenShield width={width} height={height} {...props} />;

export default SetupCompleteShield;
