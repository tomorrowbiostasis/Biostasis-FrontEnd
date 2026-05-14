import React, {FC} from 'react';
import Svg, {G, Path} from 'react-native-svg';

interface WelcomeHeroProps {
  width?: number;
  height?: number;
}

const WelcomeHero: FC<WelcomeHeroProps> = ({width = 243.75, height = 134.062}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 243.75 134.062" fill="none">
      <G>
        <Path
          d="M24.375 67.0312H60.9375L73.125 30.4688L85.3125 103.594L97.5 54.8438L109.688 67.0312H219.375"
          stroke="#FFFFFF"
          strokeOpacity={0.5}
          strokeWidth={1.82812}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M121.875 24.375L143.812 34.125V60.9375C143.812 75.5625 134.062 85.3125 121.875 90.1875C109.688 85.3125 99.9375 75.5625 99.9375 60.9375V34.125L121.875 24.375Z"
          fill="#FFFFFF"
          fillOpacity={0.12}
          stroke="#FFFFFF"
          strokeOpacity={0.3}
          strokeWidth={1.82812}
        />
        <Path
          d="M113.344 57.2812L119.438 63.375L131.625 48.75"
          stroke="#FFFFFF"
          strokeOpacity={0.8}
          strokeWidth={2.4375}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M36.5625 28.0312C38.5818 28.0312 40.2188 26.3943 40.2188 24.375C40.2188 22.3557 38.5818 20.7188 36.5625 20.7188C34.5432 20.7188 32.9062 22.3557 32.9062 24.375C32.9062 26.3943 34.5432 28.0312 36.5625 28.0312Z"
          fill="#FFFFFF"
          fillOpacity={0.2}
        />
        <Path
          d="M207.188 41.4375C209.88 41.4375 212.062 39.2549 212.062 36.5625C212.062 33.8701 209.88 31.6875 207.188 31.6875C204.495 31.6875 202.312 33.8701 202.312 36.5625C202.312 39.2549 204.495 41.4375 207.188 41.4375Z"
          fill="#15998E"
          fillOpacity={0.6}
        />
        <Path
          d="M188.906 107.25C190.926 107.25 192.562 105.613 192.562 103.594C192.562 101.574 190.926 99.9375 188.906 99.9375C186.887 99.9375 185.25 101.574 185.25 103.594C185.25 105.613 186.887 107.25 188.906 107.25Z"
          fill="#FFFFFF"
          fillOpacity={0.2}
        />
      </G>
    </Svg>
  );
};

export default WelcomeHero;
