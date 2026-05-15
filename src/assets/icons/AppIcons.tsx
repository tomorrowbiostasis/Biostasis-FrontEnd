import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';
import {semanticColors} from '~/theme/tokens';

/**
 * Line-icon set for the redesign (Lucide-style geometry).
 * Stroke is inherited from the <Svg> element, so a single `color` prop
 * recolors the whole glyph.
 */

export type AppIconProps = SvgProps & {
  size?: number;
  color?: string;
};

const makeIcon = (children: React.ReactNode, viewBox = 24, strokeWidth = 2) => {
  const Icon = ({size = 24, color = semanticColors.primary, ...props}: AppIconProps) => (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      {children}
    </Svg>
  );
  return React.memo(Icon);
};

export const HomeIcon = makeIcon(
  <>
    <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <Path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </>,
);

export const UserIcon = makeIcon(
  <>
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </>,
);

export const ChevronRightIcon = makeIcon(<Path d="m9 18 6-6-6-6" />);

export const HeartPulseIcon = makeIcon(
  <>
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
    <Path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </>,
);

export const HeartIcon = makeIcon(
  <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />,
);

export const FootprintsIcon = makeIcon(
  <>
    <Path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
    <Path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
    <Path d="M16 17h4" />
    <Path d="M4 13h4" />
  </>,
);

export const TrendingUpIcon = makeIcon(
  <>
    <Path d="M16 7h6v6" />
    <Path d="m22 7-8.5 8.5-5-5L2 17" />
  </>,
);

export const RadioIcon = makeIcon(
  <>
    <Path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <Path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <Circle cx={12} cy={12} r={2} />
    <Path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <Path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </>,
);

export const ClipboardListIcon = makeIcon(
  <>
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
    <Path d="M12 11h4" />
    <Path d="M12 16h4" />
    <Path d="M8 11h.01" />
    <Path d="M8 16h.01" />
  </>,
);

export const SlidersIcon = makeIcon(
  <>
    <Path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3" />
    <Path d="M14 2v4M8 10v4M16 18v4" />
  </>,
);

export const ShieldCheckIcon = makeIcon(
  <>
    <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <Path d="m9 12 2 2 4-4" />
  </>,
);

export const CheckIcon = makeIcon(<Path d="M20 6 9 17l-5-5" />);

export const BellIcon = makeIcon(
  <>
    <Path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <Path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8a6 6 0 0 0-12 0c0 4.499-1.411 5.956-2.738 7.326" />
  </>,
);

export const LightbulbIcon = makeIcon(
  <>
    <Path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <Path d="M9 18h6" />
    <Path d="M10 22h4" />
  </>,
);

export const FileTextIcon = makeIcon(
  <>
    <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <Path d="M14 2v6h6" />
    <Path d="M16 13H8M16 17H8M10 9H8" />
  </>,
);

export const AlertTriangleIcon = makeIcon(
  <>
    <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <Path d="M12 9v4" />
    <Path d="M12 17h.01" />
  </>,
);

export const SettingsGearIcon = makeIcon(
  <>
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <Circle cx={12} cy={12} r={3} />
  </>,
);

export const ArrowLeftIcon = makeIcon(
  <>
    <Path d="m12 19-7-7 7-7" />
    <Path d="M19 12H5" />
  </>,
);

export const BroadcastIcon = React.memo(
  ({size = 24, color = semanticColors.primary, ...props}: AppIconProps) => (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Circle cx={9} cy={9} r={2.25} stroke={color} strokeWidth={1.5} />
      <Path
        d="M14.3025 3.69727C15.7085 5.10372 16.4984 7.01103 16.4984 8.99977C16.4984 10.9885 15.7085 12.8958 14.3025 14.3023M3.69749 3.69727C2.29145 5.10372 1.50159 7.01103 1.50159 8.99977C1.50159 10.9885 2.29145 12.8958 3.69749 14.3023"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  ),
);

export const EmergencySystemIcon = React.memo(
  ({size = 24, color = semanticColors.primary, ...props}: AppIconProps) => (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M3.67617 12.0753C0.751172 9.15029 0.751172 4.35029 3.67617 1.42529"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.85011 3.52539C5.13859 4.26262 4.69325 5.21609 4.58458 6.2349C4.4759 7.25371 4.7101 8.27966 5.25011 9.15039"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 8.25C9.82843 8.25 10.5 7.57843 10.5 6.75C10.5 5.92157 9.82843 5.25 9 5.25C8.17157 5.25 7.5 5.92157 7.5 6.75C7.5 7.57843 8.17157 8.25 9 8.25Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.1523 3.59961C13.6523 5.09961 13.8473 7.43211 12.7523 9.20211"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.3262 1.42529C15.0214 2.11915 15.5731 2.94331 15.9494 3.85061C16.3258 4.75791 16.5195 5.73053 16.5195 6.71279C16.5195 7.69506 16.3258 8.66768 15.9494 9.57498C15.5731 10.4823 15.0214 11.3064 14.3262 12.0003"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 8.25V16.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.75 16.5H11.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
);

/* Settings-row glyphs — exact paths from Figma icon set 382-18912 (18×18, 1.5 stroke). */

export const UserPlusIcon = makeIcon(
  <>
    <Path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75" />
    <Path d="M6.75 8.25C8.40685 8.25 9.75 6.90685 9.75 5.25C9.75 3.59315 8.40685 2.25 6.75 2.25C5.09315 2.25 3.75 3.59315 3.75 5.25C3.75 6.90685 5.09315 8.25 6.75 8.25Z" />
    <Path d="M14.25 6V10.5" />
    <Path d="M16.5 8.25H12" />
  </>,
  18,
  1.5,
);

export const UserCheckIcon = makeIcon(
  <>
    <Path d="M1.5 15.7502C1.50009 14.8059 1.72305 13.875 2.15074 13.0331C2.57844 12.1913 3.1988 11.4622 3.96137 10.9053C4.72394 10.3484 5.60718 9.97935 6.53928 9.82815C7.47137 9.67695 8.42599 9.74788 9.3255 10.0352" />
    <Path d="M7.5 9.75C9.57107 9.75 11.25 8.07107 11.25 6C11.25 3.92893 9.57107 2.25 7.5 2.25C5.42893 2.25 3.75 3.92893 3.75 6C3.75 8.07107 5.42893 9.75 7.5 9.75Z" />
    <Path d="M11.25 14.25L12.75 15.75L15.75 12.75" />
  </>,
  18,
  1.5,
);

export const ScrollTextIcon = makeIcon(
  <>
    <Path d="M11.25 9H7.5" />
    <Path d="M11.25 6H7.5" />
    <Path d="M14.25 12.75V3.75C14.25 3.35218 14.092 2.97064 13.8107 2.68934C13.5294 2.40804 13.1478 2.25 12.75 2.25H3" />
    <Path d="M6 15.75H15C15.3978 15.75 15.7794 15.592 16.0607 15.3107C16.342 15.0294 16.5 14.6478 16.5 14.25V13.5C16.5 13.3011 16.421 13.1103 16.2803 12.9697C16.1397 12.829 15.9489 12.75 15.75 12.75H8.25C8.05109 12.75 7.86032 12.829 7.71967 12.9697C7.57902 13.1103 7.5 13.3011 7.5 13.5V14.25C7.5 14.6478 7.34196 15.0294 7.06066 15.3107C6.77936 15.592 6.39782 15.75 6 15.75ZM6 15.75C5.60218 15.75 5.22064 15.592 4.93934 15.3107C4.65804 15.0294 4.5 14.6478 4.5 14.25V3.75C4.5 3.35218 4.34196 2.97064 4.06066 2.68934C3.77936 2.40804 3.39782 2.25 3 2.25C2.60218 2.25 2.22064 2.40804 1.93934 2.68934C1.65804 2.97064 1.5 3.35218 1.5 3.75V5.25C1.5 5.44891 1.57902 5.63968 1.71967 5.78033C1.86032 5.92098 2.05109 6 2.25 6H4.5" />
  </>,
  18,
  1.5,
);

export const ShieldTickIcon = makeIcon(
  <>
    <Path d="M15 9.75034C15 13.5003 12.375 15.3753 9.255 16.4628C9.09162 16.5182 8.91415 16.5156 8.7525 16.4553C5.625 15.3753 3 13.5003 3 9.75034V4.50034C3 4.30142 3.07902 4.11066 3.21967 3.97001C3.36032 3.82936 3.55109 3.75034 3.75 3.75034C5.25 3.75034 7.125 2.85034 8.43 1.71034C8.58889 1.57459 8.79102 1.5 9 1.5C9.20898 1.5 9.41111 1.57459 9.57 1.71034C10.8825 2.85784 12.75 3.75034 14.25 3.75034C14.4489 3.75034 14.6397 3.82936 14.7803 3.97001C14.921 4.11066 15 4.30142 15 4.50034V9.75034Z" />
    <Path d="M6.75 9L8.25 10.5L11.25 7.5" />
  </>,
  18,
  1.5,
);

export const CircleCheckIcon = makeIcon(
  <>
    <Circle cx={12} cy={12} r={10} />
    <Path d="m9 12 2 2 4-4" />
  </>,
);

export const ShieldIcon = makeIcon(
  <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
);

export const HeartHalfIcon = makeIcon(
  <>
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
    <Path d="M12 5v16" />
  </>,
);
