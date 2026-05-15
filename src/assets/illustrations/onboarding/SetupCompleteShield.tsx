import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const SetupCompleteShield: React.FC<SvgProps> = ({
  width = 36,
  height = 38,
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 36 38"
    fill="none"
    {...props}>
    <Path
      d="M18.0001 1.80957L4.42871 7.23814V18.0953C4.42871 27.1429 10.3097 33.9286 18.0001 36.1905C25.6906 33.9286 31.5716 27.1429 31.5716 18.0953V7.23814L18.0001 1.80957Z"
      fill="#0DB97A"
      fillOpacity={0.25}
      stroke="#0DB97A"
      strokeWidth={1.35714}
    />
    <Path
      d="M8.95215 19.9047H12.1188L13.9283 15.3809L17.095 23.5237L19.3569 19.9047H27.0474"
      stroke="#0DB97A"
      strokeWidth={1.62857}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SetupCompleteShield;
