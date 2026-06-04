import React, {FC} from 'react';
import {BioWelcomeScreenBackgroundCircle} from '~/assets/icons/BiostasisIcons';

interface WelcomeHeroProps {
  width?: number;
  height?: number;
}

const WelcomeHero: FC<WelcomeHeroProps> = ({width = 146, height = 146}) => {
  return <BioWelcomeScreenBackgroundCircle width={width} height={height} />;
};

export default WelcomeHero;
