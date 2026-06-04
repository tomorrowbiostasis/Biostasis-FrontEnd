import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Rect,
  G,
  Defs,
  ClipPath,
  Circle,
  Mask,
} from 'react-native-svg';

export type BiostasisIconProps = SvgProps & {
  size?: number;
};

export const BioAccountSettingsFillAlertWarning = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '32'}
      height={height ?? size ?? '32'}
      viewBox="0 0 32 32"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z" fill="#F8E9EC" fillOpacity="0.42"/>
      <Path d="M16.0018 13.7502V16.7502M16.0018 19.7502H16.0093M23.2993 20.5002L17.2993 10.0002C17.1685 9.76932 16.9787 9.57731 16.7495 9.44372C16.5202 9.31013 16.2596 9.23975 15.9943 9.23975C15.7289 9.23975 15.4683 9.31013 15.2391 9.44372C15.0098 9.57731 14.8201 9.76932 14.6893 10.0002L8.68928 20.5002C8.55704 20.7292 8.4877 20.9891 8.48828 21.2536C8.48887 21.518 8.55936 21.7776 8.69261 22.006C8.82586 22.2345 9.01714 22.4236 9.24705 22.5543C9.47696 22.685 9.73733 22.7525 10.0018 22.7502H22.0018C22.265 22.7499 22.5234 22.6804 22.7512 22.5486C22.9791 22.4169 23.1682 22.2275 23.2997 21.9995C23.4311 21.7715 23.5003 21.513 23.5002 21.2498C23.5002 20.9866 23.4309 20.7281 23.2993 20.5002Z" stroke="#D6455D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioAccountSettingsFillDocumentDark = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '32'}
      height={height ?? size ?? '32'}
      viewBox="0 0 32 32"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z" fill="#0D1B2A"/>
      <Path d="M17.3334 9.3335H12.0001C11.6465 9.3335 11.3073 9.47397 11.0573 9.72402C10.8072 9.97407 10.6667 10.3132 10.6667 10.6668V21.3335C10.6667 21.6871 10.8072 22.0263 11.0573 22.2763C11.3073 22.5264 11.6465 22.6668 12.0001 22.6668H20.0001C20.3537 22.6668 20.6928 22.5264 20.9429 22.2763C21.1929 22.0263 21.3334 21.6871 21.3334 21.3335V13.3335L17.3334 9.3335Z" stroke="white" strokeWidth="1.33333"/>
    </Svg>
  ),
);

export const BioAccountSettingsFillLock = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#CDEAE7" fillOpacity="0.6"/>
      <G clipPath="url(#BioAccountSettingsFillLock_clip0_539_2096)">
      <Path d="M13.5 15C13.5 13.8065 13.9741 12.6619 14.818 11.818C15.6619 10.9741 16.8065 10.5 18 10.5C19.1935 10.5 20.3381 10.9741 21.182 11.818C22.0259 12.6619 22.5 13.8065 22.5 15C22.5 20.25 24.75 21.75 24.75 21.75H11.25C11.25 21.75 13.5 20.25 13.5 15Z" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16.7227 24.75C16.8482 24.9783 17.0327 25.1688 17.257 25.3014C17.4813 25.434 17.7371 25.504 17.9977 25.504C18.2582 25.504 18.514 25.434 18.7383 25.3014C18.9626 25.1688 19.1471 24.9783 19.2727 24.75" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 10.5C11.1 11.775 10.5 13.275 10.5 15" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M25.5 15C25.5 13.275 24.9 11.775 24 10.5" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioAccountSettingsFillLock_clip0_539_2096">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioAccountSettingsFillSettings = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#F6EDC9" fillOpacity="0.6"/>
      <Path d="M20.25 19.5C20.4 18.75 20.775 18.225 21.375 17.625C22.125 16.95 22.5 15.975 22.5 15C22.5 13.8065 22.0259 12.6619 21.182 11.818C20.3381 10.9741 19.1935 10.5 18 10.5C16.8065 10.5 15.6619 10.9741 14.818 11.818C13.9741 12.6619 13.5 13.8065 13.5 15C13.5 15.75 13.65 16.65 14.625 17.625C15.15 18.15 15.6 18.75 15.75 19.5" stroke="#B59B1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 22.5H20.25" stroke="#B59B1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16.5 25.5H19.5" stroke="#B59B1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioAccountSettingsOutlineDocument = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '16'}
      height={height ?? size ?? '16'}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path d="M9.33341 1.3335H4.00008C3.64646 1.3335 3.30732 1.47397 3.05727 1.72402C2.80722 1.97407 2.66675 2.31321 2.66675 2.66683V13.3335C2.66675 13.6871 2.80722 14.0263 3.05727 14.2763C3.30732 14.5264 3.64646 14.6668 4.00008 14.6668H12.0001C12.3537 14.6668 12.6928 14.5264 12.9429 14.2763C13.1929 14.0263 13.3334 13.6871 13.3334 13.3335V5.3335L9.33341 1.3335Z" stroke="white" strokeWidth="1.33333"/>
    </Svg>
  ),
);

export const BioAccountSettingsOutlineLock = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioAccountSettingsOutlineLock_clip0_539_2129)">
      <Path d="M4.5 6C4.5 4.80653 4.97411 3.66193 5.81802 2.81802C6.66193 1.97411 7.80653 1.5 9 1.5C10.1935 1.5 11.3381 1.97411 12.182 2.81802C13.0259 3.66193 13.5 4.80653 13.5 6C13.5 11.25 15.75 12.75 15.75 12.75H2.25C2.25 12.75 4.5 11.25 4.5 6Z" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7.72266 15.75C7.84819 15.9783 8.03274 16.1688 8.25702 16.3014C8.48131 16.434 8.73709 16.504 8.99766 16.504C9.25822 16.504 9.51401 16.434 9.73829 16.3014C9.96257 16.1688 10.1471 15.9783 10.2727 15.75" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M3 1.5C2.1 2.775 1.5 4.275 1.5 6" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16.5 6C16.5 4.275 15.9 2.775 15 1.5" stroke="#2C9C94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioAccountSettingsOutlineLock_clip0_539_2129">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioAccountSettingsOutlineLucideTriangleAlert = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M9.00178 6.75017V9.75017M9.00178 12.7502H9.00928M16.2993 13.5002L10.2993 3.00017C10.1685 2.76932 9.97873 2.57731 9.74947 2.44372C9.52021 2.31013 9.25962 2.23975 8.99428 2.23975C8.72894 2.23975 8.46834 2.31013 8.23909 2.44372C8.00983 2.57731 7.82011 2.76932 7.68928 3.00017L1.68928 13.5002C1.55704 13.7292 1.4877 13.9891 1.48828 14.2536C1.48887 14.518 1.55936 14.7776 1.69261 15.006C1.82586 15.2345 2.01714 15.4236 2.24705 15.5543C2.47696 15.685 2.73733 15.7525 3.00178 15.7502H15.0018C15.265 15.7499 15.5234 15.6804 15.7512 15.5486C15.9791 15.4169 16.1682 15.2275 16.2997 14.9995C16.4311 14.7715 16.5003 14.513 16.5002 14.2498C16.5002 13.9866 16.4309 13.7281 16.2993 13.5002Z" stroke="#D6455D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioAccountSettingsOutlineSettings = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M11.25 10.5C11.4 9.75 11.775 9.225 12.375 8.625C13.125 7.95 13.5 6.975 13.5 6C13.5 4.80653 13.0259 3.66193 12.182 2.81802C11.3381 1.97411 10.1935 1.5 9 1.5C7.80653 1.5 6.66193 1.97411 5.81802 2.81802C4.97411 3.66193 4.5 4.80653 4.5 6C4.5 6.75 4.65 7.65 5.625 8.625C6.15 9.15 6.6 9.75 6.75 10.5" stroke="#B59B1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 13.5H11.25" stroke="#B59B1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7.5 16.5H10.5" stroke="#B59B1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencyContactFillDocumentFill = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '32'}
      height={height ?? size ?? '32'}
      viewBox="0 0 32 32"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z" fill="#FEF0EE"/>
      <Path d="M17.3332 9.3335H11.9998C11.6462 9.3335 11.3071 9.47397 11.057 9.72402C10.807 9.97407 10.6665 10.3132 10.6665 10.6668V21.3335C10.6665 21.6871 10.807 22.0263 11.057 22.2763C11.3071 22.5264 11.6462 22.6668 11.9998 22.6668H19.9998C20.3535 22.6668 20.6926 22.5264 20.9426 22.2763C21.1927 22.0263 21.3332 21.6871 21.3332 21.3335V13.3335L17.3332 9.3335Z" stroke="#E0392C" strokeWidth="1.33333"/>
    </Svg>
  ),
);

export const BioEmergencyContactFillDocument = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#D9E4F0" fillOpacity="0.6"/>
      <Path d="M24 14.25H21.75C21.3522 14.25 20.9706 14.092 20.6893 13.8107C20.408 13.5294 20.25 13.1478 20.25 12.75V10.5" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 22.5C15.3522 22.5 14.9706 22.342 14.6893 22.0607C14.408 21.7794 14.25 21.3978 14.25 21V12C14.25 11.6022 14.408 11.2206 14.6893 10.9393C14.9706 10.658 15.3522 10.5 15.75 10.5H21L24 13.5V21C24 21.3978 23.842 21.7794 23.5607 22.0607C23.2794 22.342 22.8978 22.5 22.5 22.5H15.75Z" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11.25 14.6997V24.2997C11.25 24.618 11.3764 24.9232 11.6015 25.1482C11.8265 25.3733 12.1317 25.4997 12.45 25.4997H20.25" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencyContactFillMapPin = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#D4ECE6" fillOpacity="0.6"/>
      <Path d="M24 16.5C24 20.2448 19.8457 24.1447 18.4507 25.3492C18.3208 25.447 18.1626 25.4998 18 25.4998C17.8374 25.4998 17.6792 25.447 17.5493 25.3492C16.1543 24.1447 12 20.2448 12 16.5C12 14.9087 12.6321 13.3826 13.7574 12.2574C14.8826 11.1321 16.4087 10.5 18 10.5C19.5913 10.5 21.1174 11.1321 22.2426 12.2574C23.3679 13.3826 24 14.9087 24 16.5Z" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 18.75C19.2426 18.75 20.25 17.7426 20.25 16.5C20.25 15.2574 19.2426 14.25 18 14.25C16.7574 14.25 15.75 15.2574 15.75 16.5C15.75 17.7426 16.7574 18.75 18 18.75Z" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencyContactOutlineCircleStatus = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '16'}
      height={height ?? size ?? '16'}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <G clipPath="url(#BioEmergencyContactOutlineCircleStatus_clip0_539_2151)">
      <Path d="M8.00016 14.6668C11.6821 14.6668 14.6668 11.6821 14.6668 8.00016C14.6668 4.31826 11.6821 1.3335 8.00016 1.3335C4.31826 1.3335 1.3335 4.31826 1.3335 8.00016C1.3335 11.6821 4.31826 14.6668 8.00016 14.6668Z" stroke="#3D5470" strokeWidth="1.33333"/>
      <Path d="M8 5.3335V10.6668" stroke="#3D5470" strokeWidth="1.33333"/>
      <Path d="M5.3335 8H10.6668" stroke="#3D5470" strokeWidth="1.33333"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencyContactOutlineCircleStatus_clip0_539_2151">
      <Rect width="16" height="16" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencyContactOutlineDocumentFolded = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M15 5.25H12.75C12.3522 5.25 11.9706 5.09196 11.6893 4.81066C11.408 4.52936 11.25 4.14782 11.25 3.75V1.5" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 13.5C6.35218 13.5 5.97064 13.342 5.68934 13.0607C5.40804 12.7794 5.25 12.3978 5.25 12V3C5.25 2.60218 5.40804 2.22064 5.68934 1.93934C5.97064 1.65804 6.35218 1.5 6.75 1.5H12L15 4.5V12C15 12.3978 14.842 12.7794 14.5607 13.0607C14.2794 13.342 13.8978 13.5 13.5 13.5H6.75Z" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M2.25 5.69971V15.2997C2.25 15.618 2.37643 15.9232 2.60147 16.1482C2.82652 16.3733 3.13174 16.4997 3.45 16.4997H11.25" stroke="#4A6FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencyContactOutlineDocument = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '16'}
      height={height ?? size ?? '16'}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path d="M9.33317 1.3335H3.99984C3.64622 1.3335 3.30708 1.47397 3.05703 1.72402C2.80698 1.97407 2.6665 2.31321 2.6665 2.66683V13.3335C2.6665 13.6871 2.80698 14.0263 3.05703 14.2763C3.30708 14.5264 3.64622 14.6668 3.99984 14.6668H11.9998C12.3535 14.6668 12.6926 14.5264 12.9426 14.2763C13.1927 14.0263 13.3332 13.6871 13.3332 13.3335V5.3335L9.33317 1.3335Z" stroke="#E0392C" strokeWidth="1.33333"/>
    </Svg>
  ),
);

export const BioEmergencyContactOutlineMapPin = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M15 7.5C15 11.2448 10.8457 15.1447 9.45075 16.3492C9.32079 16.447 9.1626 16.4998 9 16.4998C8.8374 16.4998 8.67921 16.447 8.54925 16.3492C7.15425 15.1447 3 11.2448 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencySettingsFillCalendar = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#E4DBF7" fillOpacity="0.6"/>
      <Path d="M24.75 14.625V13.5C24.75 13.1022 24.592 12.7206 24.3107 12.4393C24.0294 12.158 23.6478 12 23.25 12H12.75C12.3522 12 11.9706 12.158 11.6893 12.4393C11.408 12.7206 11.25 13.1022 11.25 13.5V24C11.25 24.3978 11.408 24.7794 11.6893 25.0607C11.9706 25.342 12.3522 25.5 12.75 25.5H15.375" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21 10.5V13.5" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 10.5V13.5" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11.25 16.5H15" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22.5 25.5C24.1569 25.5 25.5 24.1569 25.5 22.5C25.5 20.8431 24.1569 19.5 22.5 19.5C20.8431 19.5 19.5 20.8431 19.5 22.5C19.5 24.1569 20.8431 25.5 22.5 25.5Z" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22.5 21.375V22.5L23.25 23.25" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencySettingsFillClockPause = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="7.2" fill="#D97706" fillOpacity="0.15"/>
      <G clipPath="url(#BioEmergencySettingsFillClockPause_clip0_539_2166)">
      <Path d="M18 25.5C22.1421 25.5 25.5 22.1421 25.5 18C25.5 13.8579 22.1421 10.5 18 10.5C13.8579 10.5 10.5 13.8579 10.5 18C10.5 22.1421 13.8579 25.5 18 25.5Z" stroke="#D97706" strokeWidth="1.35"/>
      <Path d="M16.5 20.25V15.75" stroke="#D97706" strokeWidth="1.35"/>
      <Path d="M19.5 20.25V15.75" stroke="#D97706" strokeWidth="1.35"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencySettingsFillClockPause_clip0_539_2166">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencySettingsFillClock = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#F3DEC7" fillOpacity="0.6"/>
      <G clipPath="url(#BioEmergencySettingsFillClock_clip0_539_2165)">
      <Path d="M18 25.5C22.1421 25.5 25.5 22.1421 25.5 18C25.5 13.8579 22.1421 10.5 18 10.5C13.8579 10.5 10.5 13.8579 10.5 18C10.5 22.1421 13.8579 25.5 18 25.5Z" stroke="#B86E2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.8203 15.7495C15.9966 15.2482 16.3447 14.8255 16.8028 14.5563C17.2609 14.2871 17.7995 14.1887 18.3232 14.2785C18.8469 14.3683 19.3219 14.6406 19.6641 15.0471C20.0063 15.4536 20.1936 15.9681 20.1928 16.4995C20.1928 17.9995 17.9428 18.7495 17.9428 18.7495" stroke="#B86E2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 21.75H18.0075" stroke="#B86E2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencySettingsFillClock_clip0_539_2165">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencySettingsFillEcgWave = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#F5D6E6" fillOpacity="0.6"/>
      <G clipPath="url(#BioEmergencySettingsFillEcgWave_clip0_539_2172)">
      <Path d="M10.5 20.25C15.5002 15.75 20.4998 20.25 25.5 15.75" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 25.4996C17.0985 24.0011 17.6385 22.5034 17.8553 21.0049" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20.2517 10.5C18.9032 11.9985 18.3632 13.4963 18.1465 14.9948" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21.75 13.5L19.875 11.625" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M19.5 15L18.75 14.25" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.25 22.5L16.125 24.375" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11.625 19.875L12 20.25" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M24 15.75L24.375 16.125" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M13.875 18.375L14.625 19.125" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencySettingsFillEcgWave_clip0_539_2172">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencySettingsFillFlame = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#DCE4F7" fillOpacity="0.6"/>
      <Path d="M18 11.25C17.1049 12.1451 16.602 13.3591 16.602 14.625C16.602 15.8909 17.1049 17.1049 18 18C18.8951 18.8951 20.1091 19.398 21.375 19.398C22.6409 19.398 23.8549 18.8951 24.75 18C24.75 19.335 24.3541 20.6401 23.6124 21.7501C22.8707 22.8601 21.8165 23.7253 20.5831 24.2362C19.3497 24.7471 17.9925 24.8808 16.6831 24.6203C15.3738 24.3599 14.171 23.717 13.227 22.773C12.283 21.829 11.6402 20.6262 11.3797 19.3169C11.1193 18.0075 11.2529 16.6503 11.7638 15.4169C12.2747 14.1835 13.1399 13.1293 14.2499 12.3876C15.3599 11.6459 16.665 11.25 18 11.25Z" stroke="#4C63B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M24 11.25V14.25" stroke="#4C63B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M25.5 12.75H22.5" stroke="#4C63B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencySettingsFillInfo = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#D7F0EC" fillOpacity="0.6"/>
      <Path d="M16.5 10.5H19.5" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 19.5V15" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 25.5C21.3137 25.5 24 22.8137 24 19.5C24 16.1863 21.3137 13.5 18 13.5C14.6863 13.5 12 16.1863 12 19.5C12 22.8137 14.6863 25.5 18 25.5Z" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencySettingsOutlineCalendar = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M15.75 5.625V4.5C15.75 4.10218 15.592 3.72064 15.3107 3.43934C15.0294 3.15804 14.6478 3 14.25 3H3.75C3.35218 3 2.97064 3.15804 2.68934 3.43934C2.40804 3.72064 2.25 4.10218 2.25 4.5V15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H6.375" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 1.5V4.5" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 1.5V4.5" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M2.25 7.5H6" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M13.5 16.5C15.1569 16.5 16.5 15.1569 16.5 13.5C16.5 11.8431 15.1569 10.5 13.5 10.5C11.8431 10.5 10.5 11.8431 10.5 13.5C10.5 15.1569 11.8431 16.5 13.5 16.5Z" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M13.5 12.375V13.5L14.25 14.25" stroke="#6D4CCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencySettingsOutlineClockVariant = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioEmergencySettingsOutlineClockVariant_clip0_539_2205)">
      <Path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#B86E2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.82031 6.74945C6.99664 6.2482 7.34468 5.82553 7.80278 5.5563C8.26088 5.28707 8.79948 5.18865 9.32319 5.27848C9.84691 5.36831 10.3219 5.64059 10.6641 6.0471C11.0063 6.4536 11.1936 6.96809 11.1928 7.49945C11.1928 8.99945 8.94281 9.74945 8.94281 9.74945" stroke="#B86E2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 12.75H9.0075" stroke="#B86E2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencySettingsOutlineClockVariant_clip0_539_2205">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencySettingsOutlineClock = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioEmergencySettingsOutlineClock_clip0_539_2167)">
      <Path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#D97706" strokeWidth="1.35"/>
      <Path d="M7.5 11.25V6.75" stroke="#D97706" strokeWidth="1.35"/>
      <Path d="M10.5 11.25V6.75" stroke="#D97706" strokeWidth="1.35"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencySettingsOutlineClock_clip0_539_2167">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencySettingsOutlineEcgWave = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioEmergencySettingsOutlineEcgWave_clip0_539_2223)">
      <Path d="M1.5 11.25C6.50025 6.75 11.4998 11.25 16.5 6.75" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 16.4996C8.0985 15.0011 8.6385 13.5034 8.85525 12.0049" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11.2517 1.5C9.90323 2.9985 9.36323 4.49625 9.14648 5.99475" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12.75 4.5L10.875 2.625" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10.5 6L9.75 5.25" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M5.25 13.5L7.125 15.375" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M2.625 10.875L3 11.25" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 6.75L15.375 7.125" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M4.875 9.375L5.625 10.125" stroke="#C23A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioEmergencySettingsOutlineEcgWave_clip0_539_2223">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioEmergencySettingsOutlineFlame = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M9 2.25C8.1049 3.14511 7.60203 4.35913 7.60203 5.625C7.60203 6.89087 8.1049 8.10489 9 9C9.89511 9.89511 11.1091 10.398 12.375 10.398C13.6409 10.398 14.8549 9.89511 15.75 9C15.75 10.335 15.3541 11.6401 14.6124 12.7501C13.8707 13.8601 12.8165 14.7253 11.5831 15.2362C10.3497 15.7471 8.99252 15.8808 7.68314 15.6203C6.37377 15.3599 5.17104 14.717 4.22703 13.773C3.28303 12.829 2.64015 11.6262 2.3797 10.3169C2.11925 9.00749 2.25292 7.65029 2.76382 6.41689C3.27471 5.18349 4.13987 4.12928 5.2499 3.38758C6.35994 2.64588 7.66498 2.25 9 2.25Z" stroke="#4C63B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 2.25V5.25" stroke="#4C63B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16.5 3.75H13.5" stroke="#4C63B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioEmergencySettingsOutlineInfo = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M7.5 1.5H10.5" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 10.5V6" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 16.5C12.3137 16.5 15 13.8137 15 10.5C15 7.18629 12.3137 4.5 9 4.5C5.68629 4.5 3 7.18629 3 10.5C3 13.8137 5.68629 16.5 9 16.5Z" stroke="#2C8F86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioHomeFillBroadcastSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#CFE9DF" fillOpacity="0.5"/>
      <G clipPath="url(#BioHomeFillBroadcastSignal_clip0_539_1987)">
      <Path d="M12.6762 21.0753C9.75117 18.1503 9.75117 13.3503 12.6762 10.4253" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.8501 12.5254C14.1386 13.2626 13.6932 14.2161 13.5846 15.2349C13.4759 16.2537 13.7101 17.2797 14.2501 18.1504" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 17.25C18.8284 17.25 19.5 16.5784 19.5 15.75C19.5 14.9216 18.8284 14.25 18 14.25C17.1716 14.25 16.5 14.9216 16.5 15.75C16.5 16.5784 17.1716 17.25 18 17.25Z" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21.1523 12.5996C22.6523 14.0996 22.8473 16.4321 21.7523 18.2021" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M23.3262 10.4253C24.0214 11.1191 24.5731 11.9433 24.9494 12.8506C25.3258 13.7579 25.5195 14.7305 25.5195 15.7128C25.5195 16.6951 25.3258 17.6677 24.9494 18.575C24.5731 19.4823 24.0214 20.3064 23.3262 21.0003" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 17.25V25.5" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 25.5H20.25" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioHomeFillBroadcastSignal_clip0_539_1987">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioHomeFillCircleCheck = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#D9EFE6" fillOpacity="0.6"/>
      <G clipPath="url(#BioHomeFillCircleCheck_clip0_539_2007)">
      <Path d="M25.5 17.3099V17.9999C25.4991 19.6172 24.9754 21.1909 24.007 22.4863C23.0386 23.7816 21.6775 24.7293 20.1265 25.1878C18.5756 25.6464 16.9179 25.5913 15.4009 25.0308C13.8838 24.4703 12.5885 23.4345 11.7082 22.0777C10.8279 20.7209 10.4098 19.1159 10.5163 17.5021C10.6227 15.8883 11.2479 14.3521 12.2987 13.1227C13.3495 11.8933 14.7696 11.0364 16.3471 10.68C17.9247 10.3236 19.5752 10.4867 21.0525 11.1449" stroke="#3A8F6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 17.25L18 19.5L25.5 12" stroke="#3A8F6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioHomeFillCircleCheck_clip0_539_2007">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioHomeFillClipboard = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#F3DEC7" fillOpacity="0.6"/>
      <Path d="M20.25 10.5H15.75C15.3358 10.5 15 10.8358 15 11.25V12.75C15 13.1642 15.3358 13.5 15.75 13.5H20.25C20.6642 13.5 21 13.1642 21 12.75V11.25C21 10.8358 20.6642 10.5 20.25 10.5Z" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21 12H22.5C22.8978 12 23.2794 12.158 23.5607 12.4393C23.842 12.7206 24 13.1022 24 13.5V24C24 24.3978 23.842 24.7794 23.5607 25.0607C23.2794 25.342 22.8978 25.5 22.5 25.5H13.5C13.1022 25.5 12.7206 25.342 12.4393 25.0607C12.158 24.7794 12 24.3978 12 24V13.5C12 13.1022 12.158 12.7206 12.4393 12.4393C12.7206 12.158 13.1022 12 13.5 12H15" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 18H20.25" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 21H20.25" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 15H17.25" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioHomeFillMenuHamburger = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '44'}
      height={height ?? size ?? '44'}
      viewBox="0 0 44 44"
      fill="none"
      {...props}>
      <Mask id="BioHomeFillMenuHamburger_path-1-inside-1_539_1945" fill="white">
      <Path d="M0 14C0 6.26801 6.26801 0 14 0H29.875C37.607 0 43.875 6.26801 43.875 14V29.875C43.875 37.607 37.607 43.875 29.875 43.875H14C6.26801 43.875 0 37.607 0 29.875V14Z"/>
      </Mask>
      <Path d="M0 14C0 6.26801 6.26801 0 14 0H29.875C37.607 0 43.875 6.26801 43.875 14V29.875C43.875 37.607 37.607 43.875 29.875 43.875H14C6.26801 43.875 0 37.607 0 29.875V14Z" fill="#F5F6F8"/>
      <Path d="M14 0V1.21875H29.875V0V-1.21875H14V0ZM43.875 14H42.6562V29.875H43.875H45.0938V14H43.875ZM29.875 43.875V42.6562H14V43.875V45.0938H29.875V43.875ZM0 29.875H1.21875V14H0H-1.21875V29.875H0ZM14 43.875V42.6562C6.94111 42.6562 1.21875 36.9339 1.21875 29.875H0H-1.21875C-1.21875 38.2801 5.59492 45.0938 14 45.0938V43.875ZM43.875 29.875H42.6562C42.6562 36.9339 36.9339 42.6562 29.875 42.6562V43.875V45.0938C38.2801 45.0938 45.0938 38.2801 45.0938 29.875H43.875ZM29.875 0V1.21875C36.9339 1.21875 42.6562 6.94111 42.6562 14H43.875H45.0938C45.0938 5.59492 38.2801 -1.21875 29.875 -1.21875V0ZM14 0V-1.21875C5.59492 -1.21875 -1.21875 5.59492 -1.21875 14H0H1.21875C1.21875 6.94111 6.94111 1.21875 14 1.21875V0Z" fill="#0B1F3A" fillOpacity="0.1" mask="url(#BioHomeFillMenuHamburger_path-1-inside-1_539_1945)"/>
      <Rect x="13.4062" y="14.3203" width="17.0625" height="1.82812" rx="0.914062" fill="#0B1F3A"/>
      <Rect x="15.8438" y="21.0234" width="12.1875" height="1.82812" rx="0.914062" fill="#0B1F3A"/>
      <Rect x="13.4062" y="27.7266" width="17.0625" height="1.82812" rx="0.914062" fill="#0B1F3A"/>
    </Svg>
  ),
);

export const BioHomeFillRadioSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H28C32.4183 0 36 3.58172 36 8V28C36 32.4183 32.4183 36 28 36H8C3.58172 36 0 32.4183 0 28V8Z" fill="#FBBC05" fillOpacity="0.15"/>
      <Path d="M18 20.25C19.2426 20.25 20.25 19.2426 20.25 18C20.25 16.7574 19.2426 15.75 18 15.75C16.7574 15.75 15.75 16.7574 15.75 18C15.75 19.2426 16.7574 20.25 18 20.25Z" stroke="#FBBC05" strokeWidth="1.5"/>
      <Path d="M23.3025 12.6973C24.7085 14.1037 25.4984 16.011 25.4984 17.9998C25.4984 19.9885 24.7085 21.8958 23.3025 23.3023M12.6975 12.6973C11.2915 14.1037 10.5016 16.011 10.5016 17.9998C10.5016 19.9885 11.2915 21.8958 12.6975 23.3023" stroke="#FBBC05" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioHomeNavBarEmergencyButton = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '58'}
      height={height ?? size ?? '58'}
      viewBox="0 0 58 58"
      fill="none"
      {...props}>
      <Rect width="58" height="58" rx="29" fill="#D6455D" fillOpacity="0.2"/>
      <Rect x="9" y="9" width="40" height="40" rx="20" fill="#D6455D"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M29 23C29.5232 23 29.9474 23.4242 29.9474 23.9474V28.0526H34.0526C34.5758 28.0526 35 28.4768 35 29C35 29.5232 34.5758 29.9474 34.0526 29.9474H29.9474V34.0526C29.9474 34.5758 29.5232 35 29 35C28.4768 35 28.0526 34.5758 28.0526 34.0526V29.9474H23.9474C23.4242 29.9474 23 29.5232 23 29C23 28.4768 23.4242 28.0526 23.9474 28.0526H28.0526V23.9474C28.0526 23.4242 28.4768 23 29 23Z" fill="#F7DADF"/>
    </Svg>
  ),
);

export const BioHomeNavBarHomeActive = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '24'}
      height={height ?? size ?? '25'}
      viewBox="0 0 24 25"
      fill="none"
      {...props}>
      <Path d="M21 11.6036V20.8866C21 21.0918 20.921 21.2886 20.7803 21.4336C20.6397 21.5787 20.4489 21.6602 20.25 21.6602H15C14.8011 21.6602 14.6103 21.5787 14.4697 21.4336C14.329 21.2886 14.25 21.0918 14.25 20.8866V15.8583C14.25 15.7557 14.2105 15.6574 14.1402 15.5848C14.0698 15.5123 13.9745 15.4715 13.875 15.4715H10.125C10.0255 15.4715 9.93016 15.5123 9.85983 15.5848C9.78951 15.6574 9.75 15.7557 9.75 15.8583V20.8866C9.75 21.0918 9.67098 21.2886 9.53033 21.4336C9.38968 21.5787 9.19891 21.6602 9 21.6602H3.75C3.55109 21.6602 3.36032 21.5787 3.21967 21.4336C3.07902 21.2886 3 21.0918 3 20.8866V11.6036C3.00018 11.1933 3.15834 10.7999 3.43969 10.5099L10.9397 2.77409C11.221 2.48415 11.6023 2.32129 12 2.32129C12.3977 2.32129 12.779 2.48415 13.0603 2.77409L20.5603 10.5099C20.8417 10.7999 20.9998 11.1933 21 11.6036Z" fill="#999999"/>
    </Svg>
  ),
);

export const BioHomeNavBarHome = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '24'}
      height={height ?? size ?? '25'}
      viewBox="0 0 24 25"
      fill="none"
      {...props}>
      <Path d="M21 11.6036V20.8866C21 21.0918 20.921 21.2886 20.7803 21.4336C20.6397 21.5787 20.4489 21.6602 20.25 21.6602H15C14.8011 21.6602 14.6103 21.5787 14.4697 21.4336C14.329 21.2886 14.25 21.0918 14.25 20.8866V15.8583C14.25 15.7557 14.2105 15.6574 14.1402 15.5848C14.0698 15.5123 13.9745 15.4715 13.875 15.4715H10.125C10.0255 15.4715 9.93016 15.5123 9.85983 15.5848C9.78951 15.6574 9.75 15.7557 9.75 15.8583V20.8866C9.75 21.0918 9.67098 21.2886 9.53033 21.4336C9.38968 21.5787 9.19891 21.6602 9 21.6602H3.75C3.55109 21.6602 3.36032 21.5787 3.21967 21.4336C3.07902 21.2886 3 21.0918 3 20.8866V11.6036C3.00018 11.1933 3.15834 10.7999 3.43969 10.5099L10.9397 2.77409C11.221 2.48415 11.6023 2.32129 12 2.32129C12.3977 2.32129 12.779 2.48415 13.0603 2.77409L20.5603 10.5099C20.8417 10.7999 20.9998 11.1933 21 11.6036Z" fill="#0B1F3A"/>
    </Svg>
  ),
);

export const BioHomeNavBarUserProfile = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '24'}
      height={height ?? size ?? '24'}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path d="M19.9993 21V19C19.9993 17.9391 19.5779 16.9217 18.8277 16.1716C18.0776 15.4214 17.0602 15 15.9993 15H7.9993C6.93843 15 5.92102 15.4214 5.17087 16.1716C4.42073 16.9217 3.9993 17.9391 3.9993 19V21" fill="#0B1F3A"/>
      <Path d="M19.9993 21V19C19.9993 17.9391 19.5779 16.9217 18.8277 16.1716C18.0776 15.4214 17.0602 15 15.9993 15H7.9993C6.93843 15 5.92102 15.4214 5.17087 16.1716C4.42073 16.9217 3.9993 17.9391 3.9993 19V21" stroke="#0B1F3A" strokeWidth="2"/>
      <Path d="M12.0007 11C14.2098 11 16.0007 9.20914 16.0007 7C16.0007 4.79086 14.2098 3 12.0007 3C9.79156 3 8.0007 4.79086 8.0007 7C8.0007 9.20914 9.79156 11 12.0007 11Z" fill="#0B1F3A" stroke="#0B1F3A" strokeWidth="2"/>
    </Svg>
  ),
);

export const BioHomeNavBarUser = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '24'}
      height={height ?? size ?? '24'}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path d="M19.9993 21V19C19.9993 17.9391 19.5779 16.9217 18.8277 16.1716C18.0776 15.4214 17.0602 15 15.9993 15H7.9993C6.93843 15 5.92102 15.4214 5.17087 16.1716C4.42073 16.9217 3.9993 17.9391 3.9993 19V21" stroke="#999999" strokeWidth="2"/>
      <Path d="M12.0007 11C14.2098 11 16.0007 9.20914 16.0007 7C16.0007 4.79086 14.2098 3 12.0007 3C9.79156 3 8.0007 4.79086 8.0007 7C8.0007 9.20914 9.79156 11 12.0007 11Z" stroke="#999999" strokeWidth="2"/>
    </Svg>
  ),
);

export const BioHomeOutlineBroadcastSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioHomeOutlineBroadcastSignal_clip0_539_1957)">
      <Path d="M3.67617 12.0753C0.751172 9.15029 0.751172 4.35029 3.67617 1.42529" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M5.85011 3.52539C5.13859 4.26262 4.69325 5.21609 4.58458 6.2349C4.4759 7.25371 4.7101 8.27966 5.25011 9.15039" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 8.25C9.82843 8.25 10.5 7.57843 10.5 6.75C10.5 5.92157 9.82843 5.25 9 5.25C8.17157 5.25 7.5 5.92157 7.5 6.75C7.5 7.57843 8.17157 8.25 9 8.25Z" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12.1523 3.59961C13.6523 5.09961 13.8473 7.43211 12.7523 9.20211" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.3262 1.42529C15.0214 2.11915 15.5731 2.94331 15.9494 3.85061C16.3258 4.75791 16.5195 5.73053 16.5195 6.71279C16.5195 7.69506 16.3258 8.66768 15.9494 9.57498C15.5731 10.4823 15.0214 11.3064 14.3262 12.0003" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 8.25V16.5" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 16.5H11.25" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioHomeOutlineBroadcastSignal_clip0_539_1957">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioHomeOutlineCircleCheck = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioHomeOutlineCircleCheck_clip0_539_1974)">
      <Path d="M16.5 8.3099V8.9999C16.4991 10.6172 15.9754 12.1909 15.007 13.4863C14.0386 14.7816 12.6775 15.7293 11.1265 16.1878C9.57557 16.6464 7.91794 16.5913 6.40085 16.0308C4.88376 15.4703 3.58849 14.4345 2.70822 13.0777C1.82795 11.7209 1.40984 10.1159 1.51626 8.50213C1.62267 6.88832 2.24791 5.35214 3.29871 4.1227C4.34951 2.89326 5.76959 2.03644 7.34714 1.68001C8.92469 1.32358 10.5752 1.48665 12.0525 2.1449" stroke="#3A8F6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 8.25L9 10.5L16.5 3" stroke="#3A8F6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioHomeOutlineCircleCheck_clip0_539_1974">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioHomeOutlineClipboard = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M11.25 1.5H6.75C6.33579 1.5 6 1.83579 6 2.25V3.75C6 4.16421 6.33579 4.5 6.75 4.5H11.25C11.6642 4.5 12 4.16421 12 3.75V2.25C12 1.83579 11.6642 1.5 11.25 1.5Z" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V15C15 15.3978 14.842 15.7794 14.5607 16.0607C14.2794 16.342 13.8978 16.5 13.5 16.5H4.5C4.10218 16.5 3.72064 16.342 3.43934 16.0607C3.15804 15.7794 3 15.3978 3 15V4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H6" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 9H11.25" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 12H11.25" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 6H8.25" stroke="#B7791F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioHomeOutlineHeartEcg = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M14.25 10.5C15.3675 9.405 16.5 8.0925 16.5 6.375C16.5 5.28098 16.0654 4.23177 15.2918 3.45818C14.5182 2.6846 13.469 2.25 12.375 2.25C11.055 2.25 10.125 2.625 9 3.75C7.875 2.625 6.945 2.25 5.625 2.25C4.53098 2.25 3.48177 2.6846 2.70818 3.45818C1.9346 4.23177 1.5 5.28098 1.5 6.375C1.5 8.1 2.625 9.4125 3.75 10.5L9 15.75L14.25 10.5Z" stroke="#D6455D" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M2.41504 9H7.12504L8.25004 6.75L9.75004 10.125L10.875 7.875H15.585" stroke="#D6455D" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioHomeOutlineRadioSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#FBBC05" strokeWidth="1.5"/>
      <Path d="M14.3025 3.69727C15.7085 5.10372 16.4984 7.01103 16.4984 8.99977C16.4984 10.9885 15.7085 12.8958 14.3025 14.3023M3.69749 3.69727C2.29145 5.10372 1.50159 7.01103 1.50159 8.99977C1.50159 10.9885 2.29145 12.8958 3.69749 14.3023" stroke="#FBBC05" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioHomeOutlineSliders = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M3.00048 12V10.215C3.00048 8.625 2.22798 7.875 2.25048 6C2.27298 3.96 3.36798 1.5 5.62548 1.5C7.02798 1.5 7.50048 2.85 7.50048 4.125C7.50048 6.4575 6.00048 8.37 6.00048 10.635V12C6.00048 12.3978 5.84245 12.7794 5.56114 13.0607C5.27984 13.342 4.89831 13.5 4.50048 13.5C4.10266 13.5 3.72113 13.342 3.43982 13.0607C3.15852 12.7794 3.00048 12.3978 3.00048 12Z" stroke="#5B6F8A" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 15V13.215C15 11.625 15.7725 10.875 15.75 9C15.7275 6.96 14.6325 4.5 12.375 4.5C10.9725 4.5 10.5 5.85 10.5 7.125C10.5 9.4575 12 11.37 12 13.635V15C12 15.3978 12.158 15.7794 12.4393 16.0607C12.7206 16.342 13.1022 16.5 13.5 16.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15Z" stroke="#5B6F8A" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 12.75H15" stroke="#5B6F8A" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M3 9.75H6" stroke="#5B6F8A" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioLogInSignUpCalendarDots = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '26'}
      height={height ?? size ?? '26'}
      viewBox="0 0 26 26"
      fill="none"
      {...props}>
      <Path d="M21.125 4.0625H4.875C4.42627 4.0625 4.0625 4.42627 4.0625 4.875V21.125C4.0625 21.5737 4.42627 21.9375 4.875 21.9375H21.125C21.5737 21.9375 21.9375 21.5737 21.9375 21.125V4.875C21.9375 4.42627 21.5737 4.0625 21.125 4.0625Z" stroke="#343330" strokeWidth="1.9403" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M17.875 2.4375V5.6875" stroke="#343330" strokeWidth="1.9403" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8.125 2.4375V5.6875" stroke="#343330" strokeWidth="1.9403" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M4.0625 8.9375H21.9375" stroke="#343330" strokeWidth="1.9403" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M13 14.625C13.6731 14.625 14.2188 14.0793 14.2188 13.4062C14.2188 12.7332 13.6731 12.1875 13 12.1875C12.3269 12.1875 11.7812 12.7332 11.7812 13.4062C11.7812 14.0793 12.3269 14.625 13 14.625Z" fill="#343330"/>
      <Path d="M17.4688 14.625C18.1418 14.625 18.6875 14.0793 18.6875 13.4062C18.6875 12.7332 18.1418 12.1875 17.4688 12.1875C16.7957 12.1875 16.25 12.7332 16.25 13.4062C16.25 14.0793 16.7957 14.625 17.4688 14.625Z" fill="#343330"/>
      <Path d="M8.53125 18.6875C9.20435 18.6875 9.75 18.1418 9.75 17.4688C9.75 16.7957 9.20435 16.25 8.53125 16.25C7.85815 16.25 7.3125 16.7957 7.3125 17.4688C7.3125 18.1418 7.85815 18.6875 8.53125 18.6875Z" fill="#343330"/>
      <Path d="M13 18.6875C13.6731 18.6875 14.2188 18.1418 14.2188 17.4688C14.2188 16.7957 13.6731 16.25 13 16.25C12.3269 16.25 11.7812 16.7957 11.7812 17.4688C11.7812 18.1418 12.3269 18.6875 13 18.6875Z" fill="#343330"/>
      <Path d="M17.4688 18.6875C18.1418 18.6875 18.6875 18.1418 18.6875 17.4688C18.6875 16.7957 18.1418 16.25 17.4688 16.25C16.7957 16.25 16.25 16.7957 16.25 17.4688C16.25 18.1418 16.7957 18.6875 17.4688 18.6875Z" fill="#343330"/>
    </Svg>
  ),
);

export const BioLogInSignUpEmail = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '20'}
      height={height ?? size ?? '15'}
      viewBox="0 0 20 15"
      fill="none"
      {...props}>
      <G clipPath="url(#BioLogInSignUpEmail_clip0_539_2253)">
      <Path d="M16.4998 0.749268H2.99976C1.75712 0.749268 0.749756 1.75663 0.749756 2.99927V11.9993C0.749756 13.2419 1.75712 14.2493 2.99976 14.2493H16.4998C17.7424 14.2493 18.7498 13.2419 18.7498 11.9993V2.99927C18.7498 1.75663 17.7424 0.749268 16.4998 0.749268Z" stroke="#C2CAD3" strokeWidth="1.76636"/>
      <Path d="M0.749756 3.75L9.74976 9L18.7498 3.75" stroke="#C2CAD3" strokeWidth="1.76636" strokeLinecap="round"/>
      </G>
      <Defs>
      <ClipPath id="BioLogInSignUpEmail_clip0_539_2253">
      <Rect width="19.5" height="15" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioLogInSignUpLock = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '19'}
      height={height ?? size ?? '23'}
      viewBox="0 0 19 23"
      fill="none"
      {...props}>
      <G clipPath="url(#BioLogInSignUpLock_clip0_539_2256)">
      <Path d="M15.5451 9.73047H3.45419C2.02327 9.73047 0.863281 10.9186 0.863281 12.3843V19.4612C0.863281 20.9269 2.02327 22.1151 3.45419 22.1151H15.5451C16.976 22.1151 18.136 20.9269 18.136 19.4612V12.3843C18.136 10.9186 16.976 9.73047 15.5451 9.73047Z" stroke="#C2CAD3" strokeWidth="1.76636"/>
      <Path d="M4.31641 9.72961V7.07576C4.31641 5.66807 4.86235 4.31804 5.83413 3.32265C6.80591 2.32727 8.12392 1.76807 9.49822 1.76807C10.8725 1.76807 12.1905 2.32727 13.1623 3.32265C14.1341 4.31804 14.68 5.66807 14.68 7.07576V9.72961" stroke="#C2CAD3" strokeWidth="1.76636" strokeLinecap="round"/>
      <Path d="M9.49876 17.6913C10.4527 17.6913 11.226 16.8992 11.226 15.9221C11.226 14.9449 10.4527 14.1528 9.49876 14.1528C8.54481 14.1528 7.77148 14.9449 7.77148 15.9221C7.77148 16.8992 8.54481 17.6913 9.49876 17.6913Z" fill="#C2CAD3"/>
      </G>
      <Defs>
      <ClipPath id="BioLogInSignUpLock_clip0_539_2256">
      <Rect width="19" height="23" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioLogInSignUpMapPin = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '22'}
      height={height ?? size ?? '22'}
      viewBox="0 0 22 22"
      fill="none"
      {...props}>
      <Path d="M11 11.6875C12.5188 11.6875 13.75 10.4563 13.75 8.9375C13.75 7.41872 12.5188 6.1875 11 6.1875C9.48122 6.1875 8.25 7.41872 8.25 8.9375C8.25 10.4563 9.48122 11.6875 11 11.6875Z" stroke="#2D6BE4" strokeWidth="1.64179" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M17.875 8.9375C17.875 15.125 11 19.9375 11 19.9375C11 19.9375 4.125 15.125 4.125 8.9375C4.125 7.11414 4.84933 5.36545 6.13864 4.07614C7.42795 2.78683 9.17664 2.0625 11 2.0625C12.8234 2.0625 14.572 2.78683 15.8614 4.07614C17.1507 5.36545 17.875 7.11414 17.875 8.9375Z" stroke="#2D6BE4" strokeWidth="1.64179" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioProfileFillBook = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H28C32.4183 0 36 3.58172 36 8V28C36 32.4183 32.4183 36 28 36H8C3.58172 36 0 32.4183 0 28V8Z" fill="#F5A623" fillOpacity="0.25"/>
      <Path d="M20.9159 12.993C21.0625 12.9656 21.1923 12.8811 21.2766 12.758C21.3609 12.6349 21.3929 12.4833 21.3655 12.3367C21.3381 12.19 21.2535 12.0602 21.1304 11.9759C21.0074 11.8916 20.8558 11.8596 20.7091 11.887C19.5764 12.0994 18.6328 12.6689 18 13.5C17.2083 12.4453 15.9356 11.8125 14.4844 11.8125C13.3286 11.8138 12.2205 12.2735 11.4033 13.0908C10.586 13.908 10.1263 15.0161 10.125 16.1719C10.125 21.0938 17.4227 25.0784 17.7335 25.2422C17.8153 25.2867 17.9069 25.31 18 25.31C18.0931 25.31 18.1847 25.2867 18.2665 25.2422C19.2755 24.6766 20.2412 24.0368 21.1556 23.3283C21.2165 23.2841 21.268 23.2282 21.3069 23.1638C21.3457 23.0994 21.3713 23.0278 21.3821 22.9534C21.3928 22.8789 21.3886 22.803 21.3695 22.7303C21.3504 22.6575 21.3169 22.5893 21.271 22.5297C21.2251 22.4701 21.1677 22.4203 21.1022 22.3833C21.0367 22.3462 20.9644 22.3227 20.8897 22.3141C20.8149 22.3055 20.7392 22.312 20.667 22.3332C20.5948 22.3544 20.5276 22.3898 20.4694 22.4374C19.7445 22.9957 19.0631 23.4478 18.5625 23.7607V14.7445C18.9731 13.834 19.8239 13.1977 20.9159 12.993ZM17.4375 23.7656C15.5798 22.5991 11.25 19.5265 11.25 16.1719C11.2511 15.3144 11.5922 14.4924 12.1986 13.8861C12.8049 13.2797 13.6269 12.9386 14.4844 12.9375C15.814 12.9375 16.9355 13.6252 17.4375 14.7403V23.7656ZM25.3512 16.3125C25.3303 16.3135 25.3094 16.3135 25.2886 16.3125C25.1503 16.3123 25.0169 16.2611 24.9139 16.1688C24.8109 16.0764 24.7455 15.9494 24.7303 15.8119C24.6785 15.3435 24.5246 14.8921 24.2796 14.4895C24.0346 14.0869 23.7044 13.7429 23.3121 13.4817C23.2487 13.4415 23.1939 13.3891 23.1511 13.3274C23.1083 13.2658 23.0782 13.1962 23.0627 13.1227C23.0472 13.0493 23.0466 12.9734 23.0608 12.8997C23.0751 12.826 23.104 12.7559 23.1457 12.6935C23.1875 12.6312 23.2413 12.5778 23.3041 12.5365C23.3668 12.4953 23.4371 12.467 23.511 12.4534C23.5848 12.4397 23.6606 12.441 23.7339 12.4572C23.8072 12.4733 23.8766 12.5039 23.9379 12.5473C24.4664 12.8995 24.9114 13.3632 25.2414 13.9058C25.5715 14.4485 25.7786 15.0568 25.8483 15.6881C25.8569 15.7618 25.8508 15.8365 25.8305 15.9078C25.8101 15.9791 25.7758 16.0457 25.7296 16.1037C25.6834 16.1618 25.6262 16.2101 25.5613 16.2459C25.4963 16.2818 25.4249 16.3044 25.3512 16.3125ZM25.2042 18.817C24.8055 19.6165 24.2241 20.4342 23.4752 21.2421C23.4258 21.2989 23.3655 21.3452 23.2978 21.3782C23.2301 21.4113 23.1565 21.4304 23.0813 21.4344C23.0062 21.4385 22.9309 21.4274 22.8601 21.4019C22.7893 21.3763 22.7243 21.3368 22.669 21.2857C22.6137 21.2346 22.5693 21.1728 22.5383 21.1042C22.5073 21.0356 22.4904 20.9614 22.4886 20.8862C22.4868 20.8109 22.5002 20.736 22.5279 20.666C22.5555 20.596 22.597 20.5322 22.6498 20.4785C23.3255 19.7473 23.8451 19.0195 24.1966 18.315C24.2282 18.2466 24.2731 18.1852 24.3288 18.1345C24.3845 18.0838 24.4499 18.0448 24.5209 18.0198C24.592 17.9948 24.6674 17.9844 24.7426 17.9891C24.8177 17.9938 24.8912 18.0135 24.9586 18.0471C25.026 18.0808 25.086 18.1276 25.135 18.1849C25.1839 18.2421 25.2209 18.3086 25.2437 18.3804C25.2664 18.4522 25.2746 18.5279 25.2675 18.6029C25.2605 18.6779 25.2385 18.7507 25.2028 18.817H25.2042Z" fill="#F5A623"/>
    </Svg>
  ),
);

export const BioProfileFillHeartbeat = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H28C32.4183 0 36 3.58172 36 8V28C36 32.4183 32.4183 36 28 36H8C3.58172 36 0 32.4183 0 28V8Z" fill="#D6F5EA"/>
      <Path d="M14.0625 19.125H11.25C11.1008 19.125 10.9577 19.0657 10.8523 18.9602C10.7468 18.8548 10.6875 18.7117 10.6875 18.5625C10.6875 18.4133 10.7468 18.2702 10.8523 18.1648C10.9577 18.0593 11.1008 18 11.25 18H13.7616L14.7192 16.5628C14.7706 16.4857 14.8402 16.4224 14.9219 16.3786C15.0036 16.3349 15.0948 16.312 15.1875 16.312C15.2802 16.312 15.3714 16.3349 15.4531 16.3786C15.5348 16.4224 15.6044 16.4857 15.6558 16.5628L17.4375 19.2347L18.0942 18.2503C18.1456 18.1733 18.2153 18.1101 18.297 18.0664C18.3787 18.0228 18.4699 17.9999 18.5625 18H20.25C20.3992 18 20.5423 18.0593 20.6477 18.1648C20.7532 18.2702 20.8125 18.4133 20.8125 18.5625C20.8125 18.7117 20.7532 18.8548 20.6477 18.9602C20.5423 19.0657 20.3992 19.125 20.25 19.125H18.8634L17.9058 20.5622C17.8544 20.6393 17.7848 20.7026 17.7031 20.7464C17.6214 20.7901 17.5302 20.813 17.4375 20.813C17.3448 20.813 17.2536 20.7901 17.1719 20.7464C17.0902 20.7026 17.0206 20.6393 16.9692 20.5622L15.1875 17.8889L14.5308 18.8733C14.4795 18.9506 14.41 19.014 14.3283 19.058C14.2466 19.1019 14.1553 19.1249 14.0625 19.125ZM21.5156 11.8125C20.0637 11.8125 18.7924 12.4369 18 13.4923C17.2076 12.4369 15.9363 11.8125 14.4844 11.8125C13.3286 11.8138 12.2205 12.2735 11.4033 13.0908C10.586 13.908 10.1263 15.0161 10.125 16.1719C10.125 16.2246 10.125 16.2773 10.125 16.3301C10.1297 16.4793 10.1934 16.6205 10.3022 16.7227C10.411 16.8249 10.5559 16.8797 10.7051 16.875C10.8543 16.8703 10.9955 16.8066 11.0977 16.6978C11.1999 16.589 11.2547 16.4441 11.25 16.2949C11.25 16.2541 11.25 16.2127 11.25 16.1719C11.2511 15.3144 11.5922 14.4924 12.1986 13.8861C12.8049 13.2797 13.6269 12.9386 14.4844 12.9375C15.852 12.9375 17.0002 13.6659 17.4797 14.8359C17.5221 14.9391 17.5942 15.0273 17.6868 15.0894C17.7795 15.1515 17.8885 15.1847 18 15.1847C18.1115 15.1847 18.2205 15.1515 18.3132 15.0894C18.4058 15.0273 18.4779 14.9391 18.5203 14.8359C18.9998 13.6638 20.148 12.9375 21.5156 12.9375C22.3731 12.9386 23.1951 13.2797 23.8014 13.8861C24.4078 14.4924 24.7489 15.3144 24.75 16.1719C24.75 19.9413 19.2825 23.3543 18 24.1031C17.2385 23.6595 15.0026 22.275 13.3116 20.4321C13.2616 20.3776 13.2014 20.3335 13.1344 20.3023C13.0674 20.2711 12.9949 20.2534 12.9211 20.2502C12.8472 20.247 12.7735 20.2584 12.704 20.2837C12.6346 20.309 12.5708 20.3477 12.5163 20.3977C12.4618 20.4476 12.4177 20.5078 12.3865 20.5748C12.3553 20.6418 12.3376 20.7143 12.3344 20.7881C12.3312 20.862 12.3426 20.9357 12.3679 21.0052C12.3932 21.0746 12.4319 21.1384 12.4819 21.1929C14.6735 23.5835 17.6098 25.1782 17.7335 25.245C17.8154 25.2891 17.907 25.3121 18 25.3121C18.093 25.3121 18.1846 25.2891 18.2665 25.245C18.5773 25.0777 25.875 21.0938 25.875 16.1719C25.8737 15.0161 25.414 13.908 24.5967 13.0908C23.7795 12.2735 22.6714 11.8138 21.5156 11.8125Z" fill="#2ABFA0"/>
    </Svg>
  ),
);

export const BioProfileFillRadioSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H28C32.4183 0 36 3.58172 36 8V28C36 32.4183 32.4183 36 28 36H8C3.58172 36 0 32.4183 0 28V8Z" fill="#FBBC05" fillOpacity="0.15"/>
      <Path d="M18 20.25C19.2426 20.25 20.25 19.2426 20.25 18C20.25 16.7574 19.2426 15.75 18 15.75C16.7574 15.75 15.75 16.7574 15.75 18C15.75 19.2426 16.7574 20.25 18 20.25Z" stroke="#FBBC05" strokeWidth="1.5"/>
      <Path d="M23.3025 12.6973C24.7085 14.1037 25.4984 16.011 25.4984 17.9998C25.4984 19.9885 24.7085 21.8958 23.3025 23.3023M12.6975 12.6973C11.2915 14.1037 10.5016 16.011 10.5016 17.9998C10.5016 19.9885 11.2915 21.8958 12.6975 23.3023" stroke="#FBBC05" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioProfileFillShield = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Path d="M0 8C0 3.58172 3.58172 0 8 0H28C32.4183 0 36 3.58172 36 8V28C36 32.4183 32.4183 36 28 36H8C3.58172 36 0 32.4183 0 28V8Z" fill="#EFF3FE"/>
      <Path d="M18 25.5C18 25.5 24 22.5 24 18V12.75L18 10.5L12 12.75V18C12 22.5 18 25.5 18 25.5Z" stroke="#2563EB" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioProfileFillUser = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#0D1B2A"/>
      <Path d="M24 24.75V23.25C24 22.4544 23.6839 21.6913 23.1213 21.1287C22.5587 20.5661 21.7956 20.25 21 20.25H15C14.2044 20.25 13.4413 20.5661 12.8787 21.1287C12.3161 21.6913 12 22.4544 12 23.25V24.75" stroke="white" strokeWidth="1.5"/>
      <Path d="M18 17.25C19.6569 17.25 21 15.9069 21 14.25C21 12.5931 19.6569 11.25 18 11.25C16.3431 11.25 15 12.5931 15 14.25C15 15.9069 16.3431 17.25 18 17.25Z" stroke="white" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioProfileOutlineBook = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '16'}
      height={height ?? size ?? '14'}
      viewBox="0 0 16 14"
      fill="none"
      {...props}>
      <Path d="M10.7909 1.18055C10.9375 1.15313 11.0673 1.06858 11.1516 0.945489C11.2359 0.822396 11.2679 0.670847 11.2405 0.52418C11.2131 0.377513 11.1285 0.247743 11.0054 0.163417C10.8824 0.0790919 10.7308 0.0471187 10.5841 0.0745313C9.45141 0.286875 8.50781 0.856406 7.875 1.6875C7.08328 0.632812 5.81062 0 4.35938 0C3.2036 0.00130271 2.09553 0.461011 1.27827 1.27827C0.461011 2.09553 0.00130271 3.2036 0 4.35938C0 9.28125 7.29773 13.2659 7.60852 13.4297C7.69029 13.4742 7.7819 13.4975 7.875 13.4975C7.9681 13.4975 8.05971 13.4742 8.14148 13.4297C9.15054 12.8641 10.1162 12.2243 11.0306 11.5158C11.0915 11.4716 11.143 11.4157 11.1819 11.3513C11.2207 11.2869 11.2463 11.2153 11.2571 11.1409C11.2678 11.0664 11.2636 10.9905 11.2445 10.9178C11.2254 10.845 11.1919 10.7768 11.146 10.7172C11.1001 10.6576 11.0427 10.6078 10.9772 10.5708C10.9117 10.5337 10.8394 10.5102 10.7647 10.5016C10.6899 10.493 10.6142 10.4995 10.542 10.5207C10.4698 10.5419 10.4026 10.5773 10.3444 10.6249C9.61945 11.1832 8.93812 11.6353 8.4375 11.9482V2.93203C8.84813 2.02148 9.69891 1.38516 10.7909 1.18055ZM7.3125 11.9531C5.45484 10.7866 1.125 7.71398 1.125 4.35938C1.12612 3.50191 1.46724 2.67988 2.07356 2.07356C2.67988 1.46724 3.50191 1.12612 4.35938 1.125C5.68898 1.125 6.81047 1.81266 7.3125 2.92781V11.9531ZM15.2262 4.5C15.2053 4.50105 15.1844 4.50105 15.1636 4.5C15.0253 4.4998 14.8919 4.44864 14.7889 4.35628C14.6859 4.26393 14.6205 4.13687 14.6053 3.99937C14.5535 3.53096 14.3996 3.07959 14.1546 2.67702C13.9096 2.27445 13.5794 1.93045 13.1871 1.66922C13.1237 1.62905 13.0689 1.57659 13.0261 1.51493C12.9833 1.45327 12.9532 1.38366 12.9377 1.31021C12.9222 1.23675 12.9216 1.16094 12.9358 1.08723C12.9501 1.01352 12.979 0.943411 13.0207 0.881032C13.0625 0.818654 13.1163 0.765269 13.1791 0.724023C13.2418 0.682777 13.3121 0.654506 13.386 0.640874C13.4598 0.627243 13.5356 0.628528 13.6089 0.644653C13.6822 0.660779 13.7516 0.691418 13.8129 0.734766C14.3414 1.08697 14.7864 1.55069 15.1164 2.09333C15.4465 2.63597 15.6536 3.24433 15.7233 3.87563C15.7319 3.9493 15.7258 4.02396 15.7055 4.09529C15.6851 4.16661 15.6508 4.23321 15.6046 4.29124C15.5584 4.34928 15.5012 4.3976 15.4363 4.43342C15.3713 4.46925 15.2999 4.49188 15.2262 4.5ZM15.0792 7.00453C14.6805 7.80398 14.0991 8.62172 13.3502 9.42961C13.3008 9.4864 13.2405 9.53269 13.1728 9.56573C13.1051 9.59876 13.0315 9.61788 12.9563 9.62194C12.8812 9.62601 12.8059 9.61494 12.7351 9.58938C12.6643 9.56383 12.5993 9.52432 12.544 9.47319C12.4887 9.42206 12.4443 9.36035 12.4133 9.29172C12.3823 9.2231 12.3654 9.14895 12.3636 9.07367C12.3618 8.9984 12.3752 8.92353 12.4029 8.8535C12.4305 8.78348 12.472 8.71972 12.5248 8.66602C13.2005 7.93477 13.7201 7.20703 14.0716 6.5025C14.1032 6.43409 14.1481 6.3727 14.2038 6.322C14.2595 6.27129 14.3249 6.23228 14.3959 6.2073C14.467 6.18232 14.5424 6.17186 14.6176 6.17656C14.6927 6.18126 14.7662 6.20101 14.8336 6.23464C14.901 6.26827 14.961 6.3151 15.01 6.37235C15.0589 6.4296 15.0959 6.4961 15.1187 6.5679C15.1414 6.63971 15.1496 6.71536 15.1425 6.79036C15.1355 6.86537 15.1135 6.9382 15.0778 7.00453H15.0792Z" fill="#F5A623"/>
    </Svg>
  ),
);

export const BioProfileOutlineHeartbeat = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M5.0625 10.125H2.25C2.10082 10.125 1.95774 10.0657 1.85225 9.96025C1.74676 9.85476 1.6875 9.71168 1.6875 9.5625C1.6875 9.41332 1.74676 9.27024 1.85225 9.16475C1.95774 9.05926 2.10082 9 2.25 9H4.76156L5.71922 7.56281C5.77057 7.48566 5.84018 7.42238 5.92188 7.37862C6.00357 7.33485 6.09482 7.31195 6.1875 7.31195C6.28018 7.31195 6.37143 7.33485 6.45312 7.37862C6.53482 7.42238 6.60443 7.48566 6.65578 7.56281L8.4375 10.2347L9.09422 9.25031C9.14563 9.17326 9.21527 9.11009 9.29696 9.06642C9.37866 9.02276 9.46987 8.99994 9.5625 9H11.25C11.3992 9 11.5423 9.05926 11.6477 9.16475C11.7532 9.27024 11.8125 9.41332 11.8125 9.5625C11.8125 9.71168 11.7532 9.85476 11.6477 9.96025C11.5423 10.0657 11.3992 10.125 11.25 10.125H9.86344L8.90578 11.5622C8.85443 11.6393 8.78482 11.7026 8.70312 11.7464C8.62143 11.7901 8.53018 11.813 8.4375 11.813C8.34482 11.813 8.25357 11.7901 8.17188 11.7464C8.09018 11.7026 8.02057 11.6393 7.96922 11.5622L6.1875 8.88891L5.53078 9.87328C5.47953 9.9506 5.40996 10.014 5.32826 10.058C5.24655 10.1019 5.15526 10.1249 5.0625 10.125ZM12.5156 2.8125C11.0637 2.8125 9.79242 3.43687 9 4.49227C8.20758 3.43687 6.93633 2.8125 5.48438 2.8125C4.3286 2.8138 3.22053 3.27351 2.40327 4.09077C1.58601 4.90803 1.1263 6.0161 1.125 7.17188C1.125 7.22461 1.125 7.27734 1.125 7.33008C1.12966 7.47926 1.1934 7.62048 1.30218 7.72268C1.41097 7.82487 1.55589 7.87966 1.70508 7.875C1.85426 7.87034 1.99548 7.8066 2.09768 7.69782C2.19987 7.58903 2.25466 7.44411 2.25 7.29492C2.25 7.25414 2.25 7.21266 2.25 7.17188C2.25112 6.31441 2.59224 5.49238 3.19856 4.88606C3.80488 4.27974 4.62691 3.93862 5.48438 3.9375C6.85195 3.9375 8.00016 4.66594 8.47969 5.83594C8.52207 5.93911 8.59416 6.02735 8.6868 6.08945C8.77945 6.15155 8.88847 6.18471 9 6.18471C9.11153 6.18471 9.22055 6.15155 9.3132 6.08945C9.40584 6.02735 9.47793 5.93911 9.52031 5.83594C9.99984 4.66383 11.148 3.9375 12.5156 3.9375C13.3731 3.93862 14.1951 4.27974 14.8014 4.88606C15.4078 5.49238 15.7489 6.31441 15.75 7.17188C15.75 10.9413 10.2825 14.3543 9 15.1031C8.23852 14.6595 6.00258 13.275 4.31156 11.4321C4.26161 11.3776 4.20141 11.3335 4.13442 11.3023C4.06742 11.2711 3.99493 11.2534 3.92108 11.2502C3.84724 11.247 3.77349 11.2584 3.70404 11.2837C3.63459 11.309 3.57081 11.3477 3.51633 11.3977C3.46185 11.4476 3.41774 11.5078 3.38653 11.5748C3.35531 11.6418 3.3376 11.7143 3.3344 11.7881C3.3312 11.862 3.34258 11.9357 3.36788 12.0052C3.39319 12.0746 3.43192 12.1384 3.48188 12.1929C5.67352 14.5835 8.60977 16.1782 8.73352 16.245C8.81543 16.2891 8.90699 16.3121 9 16.3121C9.09301 16.3121 9.18457 16.2891 9.26648 16.245C9.57727 16.0777 16.875 12.0938 16.875 7.17188C16.8737 6.0161 16.414 4.90803 15.5967 4.09077C14.7795 3.27351 13.6714 2.8138 12.5156 2.8125Z" fill="#2ABFA0"/>
    </Svg>
  ),
);

export const BioProfileOutlineRadioSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#FBBC05" strokeWidth="1.5"/>
      <Path d="M14.3025 3.69727C15.7085 5.10372 16.4984 7.01103 16.4984 8.99977C16.4984 10.9885 15.7085 12.8958 14.3025 14.3023M3.69749 3.69727C2.29145 5.10372 1.50159 7.01103 1.50159 8.99977C1.50159 10.9885 2.29145 12.8958 3.69749 14.3023" stroke="#FBBC05" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioProfileOutlineShield = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M9 16.5C9 16.5 15 13.5 15 9V3.75L9 1.5L3 3.75V9C3 13.5 9 16.5 9 16.5Z" stroke="#2563EB" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioProfileOutlineUser = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75" stroke="white" strokeWidth="1.5"/>
      <Path d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z" stroke="white" strokeWidth="1.5"/>
    </Svg>
  ),
);

export const BioSettingsFillBook = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#D6E6F2" fillOpacity="0.6"/>
      <Path d="M20.25 18H16.5" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20.25 15H16.5" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M23.25 21.75V12.75C23.25 12.3522 23.092 11.9706 22.8107 11.6893C22.5294 11.408 22.1478 11.25 21.75 11.25H12" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 24.75H24C24.3978 24.75 24.7794 24.592 25.0607 24.3107C25.342 24.0294 25.5 23.6478 25.5 23.25V22.5C25.5 22.3011 25.421 22.1103 25.2803 21.9697C25.1397 21.829 24.9489 21.75 24.75 21.75H17.25C17.0511 21.75 16.8603 21.829 16.7197 21.9697C16.579 22.1103 16.5 22.3011 16.5 22.5V23.25C16.5 23.6478 16.342 24.0294 16.0607 24.3107C15.7794 24.592 15.3978 24.75 15 24.75ZM15 24.75C14.6022 24.75 14.2206 24.592 13.9393 24.3107C13.658 24.0294 13.5 23.6478 13.5 23.25V12.75C13.5 12.3522 13.342 11.9706 13.0607 11.6893C12.7794 11.408 12.3978 11.25 12 11.25C11.6022 11.25 11.2206 11.408 10.9393 11.6893C10.658 11.9706 10.5 12.3522 10.5 12.75V14.25C10.5 14.4489 10.579 14.6397 10.7197 14.7803C10.8603 14.921 11.0511 15 11.25 15H13.5" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsFillBroadcastSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#CFE9DF" fillOpacity="0.5"/>
      <G clipPath="url(#BioSettingsFillBroadcastSignal_clip0_539_2013)">
      <Path d="M12.6762 21.0753C9.75117 18.1503 9.75117 13.3503 12.6762 10.4253" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.8501 12.5254C14.1386 13.2626 13.6932 14.2161 13.5846 15.2349C13.4759 16.2537 13.7101 17.2797 14.2501 18.1504" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 17.25C18.8284 17.25 19.5 16.5784 19.5 15.75C19.5 14.9216 18.8284 14.25 18 14.25C17.1716 14.25 16.5 14.9216 16.5 15.75C16.5 16.5784 17.1716 17.25 18 17.25Z" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21.1523 12.5996C22.6523 14.0996 22.8473 16.4321 21.7523 18.2021" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M23.3262 10.4253C24.0214 11.1191 24.5731 11.9433 24.9494 12.8506C25.3258 13.7579 25.5195 14.7305 25.5195 15.7128C25.5195 16.6951 25.3258 17.6677 24.9494 18.575C24.5731 19.4823 24.0214 20.3064 23.3262 21.0003" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 17.25V25.5" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 25.5H20.25" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioSettingsFillBroadcastSignal_clip0_539_2013">
      <Rect width="18" height="18" fill="white" transform="translate(9 9)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioSettingsFillShieldCheck = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#E4DBF7" fillOpacity="0.5"/>
      <Path d="M24 18.7503C24 22.5003 21.375 24.3753 18.255 25.4628C18.0916 25.5182 17.9142 25.5156 17.7525 25.4553C14.625 24.3753 12 22.5003 12 18.7503V13.5003C12 13.3014 12.079 13.1107 12.2197 12.97C12.3603 12.8294 12.5511 12.7503 12.75 12.7503C14.25 12.7503 16.125 11.8503 17.43 10.7103C17.5889 10.5746 17.791 10.5 18 10.5C18.209 10.5 18.4111 10.5746 18.57 10.7103C19.8825 11.8578 21.75 12.7503 23.25 12.7503C23.4489 12.7503 23.6397 12.8294 23.7803 12.97C23.921 13.1107 24 13.3014 24 13.5003V18.7503Z" stroke="#7B4BB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 18L17.25 19.5L20.25 16.5" stroke="#7B4BB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsFillUserAdd = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#E4DBF7" fillOpacity="0.6"/>
      <Path d="M21 24.75V23.25C21 22.4544 20.6839 21.6913 20.1213 21.1287C19.5587 20.5661 18.7956 20.25 18 20.25H13.5C12.7044 20.25 11.9413 20.5661 11.3787 21.1287C10.8161 21.6913 10.5 22.4544 10.5 23.25V24.75" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.75 17.25C17.4069 17.25 18.75 15.9069 18.75 14.25C18.75 12.5931 17.4069 11.25 15.75 11.25C14.0931 11.25 12.75 12.5931 12.75 14.25C12.75 15.9069 14.0931 17.25 15.75 17.25Z" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M23.25 15V19.5" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M25.5 17.25H21" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsFillUserVerified = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '36'}
      viewBox="0 0 36 36"
      fill="none"
      {...props}>
      <Rect width="36" height="36" rx="8" fill="#F5F7FD"/>
      <Path d="M10.5 24.7504C10.5001 23.8061 10.723 22.8752 11.1507 22.0334C11.5784 21.1915 12.1988 20.4625 12.9614 19.9056C13.7239 19.3487 14.6072 18.9796 15.5393 18.8284C16.4714 18.6772 17.426 18.7481 18.3255 19.0354" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16.5 18.75C18.5711 18.75 20.25 17.0711 20.25 15C20.25 12.9289 18.5711 11.25 16.5 11.25C14.4289 11.25 12.75 12.9289 12.75 15C12.75 17.0711 14.4289 18.75 16.5 18.75Z" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20.25 23.25L21.75 24.75L24.75 21.75" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsOutlineBook = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M11.25 9H7.5" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11.25 6H7.5" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.25 12.75V3.75C14.25 3.35218 14.092 2.97064 13.8107 2.68934C13.5294 2.40804 13.1478 2.25 12.75 2.25H3" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 15.75H15C15.3978 15.75 15.7794 15.592 16.0607 15.3107C16.342 15.0294 16.5 14.6478 16.5 14.25V13.5C16.5 13.3011 16.421 13.1103 16.2803 12.9697C16.1397 12.829 15.9489 12.75 15.75 12.75H8.25C8.05109 12.75 7.86032 12.829 7.71967 12.9697C7.57902 13.1103 7.5 13.3011 7.5 13.5V14.25C7.5 14.6478 7.34196 15.0294 7.06066 15.3107C6.77936 15.592 6.39782 15.75 6 15.75ZM6 15.75C5.60218 15.75 5.22064 15.592 4.93934 15.3107C4.65804 15.0294 4.5 14.6478 4.5 14.25V3.75C4.5 3.35218 4.34196 2.97064 4.06066 2.68934C3.77936 2.40804 3.39782 2.25 3 2.25C2.60218 2.25 2.22064 2.40804 1.93934 2.68934C1.65804 2.97064 1.5 3.35218 1.5 3.75V5.25C1.5 5.44891 1.57902 5.63968 1.71967 5.78033C1.86032 5.92098 2.05109 6 2.25 6H4.5" stroke="#2B6E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsOutlineBroadcastSignal = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <G clipPath="url(#BioSettingsOutlineBroadcastSignal_clip0_539_2047)">
      <Path d="M3.67617 12.0753C0.751172 9.15029 0.751172 4.35029 3.67617 1.42529" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M5.85011 3.52539C5.13859 4.26262 4.69325 5.21609 4.58458 6.2349C4.4759 7.25371 4.7101 8.27966 5.25011 9.15039" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 8.25C9.82843 8.25 10.5 7.57843 10.5 6.75C10.5 5.92157 9.82843 5.25 9 5.25C8.17157 5.25 7.5 5.92157 7.5 6.75C7.5 7.57843 8.17157 8.25 9 8.25Z" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12.1523 3.59961C13.6523 5.09961 13.8473 7.43211 12.7523 9.20211" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.3262 1.42529C15.0214 2.11915 15.5731 2.94331 15.9494 3.85061C16.3258 4.75791 16.5195 5.73053 16.5195 6.71279C16.5195 7.69506 16.3258 8.66768 15.9494 9.57498C15.5731 10.4823 15.0214 11.3064 14.3262 12.0003" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 8.25V16.5" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 16.5H11.25" stroke="#2F9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioSettingsOutlineBroadcastSignal_clip0_539_2047">
      <Rect width="18" height="18" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioSettingsOutlineShieldCheck = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M15 9.75034C15 13.5003 12.375 15.3753 9.255 16.4628C9.09162 16.5182 8.91415 16.5156 8.7525 16.4553C5.625 15.3753 3 13.5003 3 9.75034V4.50034C3 4.30142 3.07902 4.11066 3.21967 3.97001C3.36032 3.82936 3.55109 3.75034 3.75 3.75034C5.25 3.75034 7.125 2.85034 8.43 1.71034C8.58889 1.57459 8.79102 1.5 9 1.5C9.20898 1.5 9.41111 1.57459 9.57 1.71034C10.8825 2.85784 12.75 3.75034 14.25 3.75034C14.4489 3.75034 14.6397 3.82936 14.7803 3.97001C14.921 4.11066 15 4.30142 15 4.50034V9.75034Z" stroke="#7B4BB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 9L8.25 10.5L11.25 7.5" stroke="#7B4BB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsOutlineUserAdd = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6.75 8.25C8.40685 8.25 9.75 6.90685 9.75 5.25C9.75 3.59315 8.40685 2.25 6.75 2.25C5.09315 2.25 3.75 3.59315 3.75 5.25C3.75 6.90685 5.09315 8.25 6.75 8.25Z" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14.25 6V10.5" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16.5 8.25H12" stroke="#7A4CC2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSettingsOutlineUserCheck = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '18'}
      height={height ?? size ?? '18'}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path d="M1.5 15.7504C1.50009 14.8061 1.72305 13.8752 2.15074 13.0334C2.57844 12.1915 3.1988 11.4625 3.96137 10.9056C4.72394 10.3487 5.60718 9.97959 6.53928 9.82839C7.47137 9.67719 8.42599 9.74813 9.3255 10.0354" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7.5 9.75C9.57107 9.75 11.25 8.07107 11.25 6C11.25 3.92893 9.57107 2.25 7.5 2.25C5.42893 2.25 3.75 3.92893 3.75 6C3.75 8.07107 5.42893 9.75 7.5 9.75Z" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11.25 14.25L12.75 15.75L15.75 12.75" stroke="#3B5BDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
);

export const BioSlidersBodySilhouetteOutline = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '242'}
      height={height ?? size ?? '219'}
      viewBox="0 0 242 219"
      fill="none"
      {...props}>
      <G clipPath="url(#BioSlidersBodySilhouetteOutline_clip0_539_1831)">
      <Path d="M61.1879 0H186.16C188.698 0.558029 199.129 0.869263 202.237 1.16373C215.356 2.52492 227.152 9.73558 234.317 20.7751C238.106 26.7054 240.548 35.0509 241.213 42.033C241.477 44.8159 241.539 48.889 242 51.4376V170.204C241.32 172.212 241.483 176.248 241.219 178.494C240.211 187.047 237.662 195.244 232.23 202C224.476 211.646 213.827 216.577 201.672 217.783C197.201 218.228 192.763 218.134 188.275 218.136L170.13 218.132H111.064H64.5484L51.0816 218.123C47.4278 218.117 43.73 218.1 40.2242 217.685C20.3737 215.334 4.38839 202.294 1.44682 181.932C-0.234978 170.29 0.378872 156.418 0.393042 144.322L0.391244 94.3837L0.312882 64.4741C0.224489 47.9129 -0.721829 30.1764 10.4469 16.5311C20.8309 3.84463 35.3291 0.540821 51.0481 0.355424C53.9562 0.321124 58.1408 0.316581 60.9748 0.0230083L61.1879 0Z" fill="#F4F8FC"/>
      <Path d="M121.345 46.2272C123.934 46.3258 128.785 49.6443 131.314 50.9575C145.089 58.1182 159.935 61.446 175.278 63.1828C179.899 63.7057 178.933 69.7639 178.906 73.1436C178.856 76.7879 178.838 80.4329 178.851 84.0774C179.091 107.512 180.199 122.88 165.11 142.974C158.703 151.227 150.707 159.258 142.184 165.335C138.094 168.25 127.139 175.077 122.426 175.854C120.69 175.874 119.17 175.61 117.588 174.859C99.4474 166.244 84.8129 153.522 73.9696 136.692C63.87 121.016 64.0431 106.364 64.4128 88.4952C64.5578 81.0683 63.9451 73.041 64.6413 65.7877C65.4348 64.7451 65.8746 64.2113 66.913 63.3894C82.9873 61.4934 93.5152 59.1214 108.301 52.779C110.207 51.95 112.071 51.0304 113.889 50.0235C116.162 48.7378 118.887 46.8991 121.345 46.2272Z" fill="#3E7DE1"/>
      <Path d="M121.375 51.532C122.566 51.4355 133.246 57.5579 135.777 58.5205C148.453 63.3417 160.325 66.5578 173.933 67.9484C173.699 76.0762 174 84.7057 173.899 92.9123C173.782 102.375 174.554 112.23 171.349 121.419C164.805 140.179 149.874 155.162 133.209 165.462C130.137 167.361 125.218 169.669 121.958 171.334C121.149 171.545 118.401 169.796 117.462 169.322C96.1218 158.557 74.9247 138.735 70.1794 114.527C68.9659 108.337 69.2478 100.891 69.2558 94.5909L69.3028 68.0684C83.0729 66.1923 95.3757 63.4794 108.286 58.1105C112.538 56.342 117.072 53.5414 121.375 51.532Z" fill="#EFF4FB"/>
      <Path d="M122.205 80.392C123.981 80.6127 124.365 81.3059 124.975 82.884C126.484 86.7918 127.475 90.8679 128.772 94.8439C130.598 100.314 132.312 105.821 133.911 111.362C134.667 113.902 135.927 117.745 136.342 120.262C139.135 116.717 142.695 107.438 144.854 102.975C145.655 102.801 146.764 102.491 147.498 102.773C149.515 103.547 151.075 107.727 152.064 109.697C155.128 109.696 158.854 109.631 161.847 109.868C162.561 110.546 163.031 111.263 163.598 112.06C163.133 112.78 162.337 113.704 161.781 114.39C159.204 114.749 151.967 114.622 149.323 114.392C147.899 112.656 147.805 112.229 147.165 110.137C143.461 115.634 141.244 121.958 138.069 127.748C136.851 129.971 134.265 129.35 133.625 127.111C132.862 124.442 132.147 121.748 131.386 119.071C128.571 109.751 125.298 100.028 122.665 90.694C122.267 93.7707 120.705 98.0427 119.747 101.083C118.881 103.83 117.221 112.542 115.543 114.236C112.745 114.733 105.261 114.514 102.141 114.554C96.5295 114.625 90.5258 114.609 84.8869 114.534C84.1156 114.421 82.4671 114.544 82.0069 113.836C81.0837 112.416 81.153 109.979 83.3534 109.925C88.0496 109.811 92.9561 109.572 97.6432 109.712C102.443 109.856 107.891 109.356 112.628 109.813C115.132 100.926 117.337 91.8671 119.96 83.0038C120.483 81.2364 120.582 81.2304 122.205 80.392Z" fill="#3E7DE1"/>
      </G>
      <Defs>
      <ClipPath id="BioSlidersBodySilhouetteOutline_clip0_539_1831">
      <Rect width="242" height="219" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioSlidersBodySilhouette = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '115'}
      height={height ?? size ?? '130'}
      viewBox="0 0 115 130"
      fill="none"
      {...props}>
      <Path d="M57.054 0C59.6437 0.0985928 64.494 3.41717 67.023 4.73031C80.7981 11.891 95.6445 15.2188 110.987 16.9556C115.608 17.4785 114.642 23.5367 114.615 26.9165C114.565 30.5608 114.547 34.2057 114.56 37.8502C114.8 61.2847 115.908 76.6528 100.82 96.7469C94.4126 105 86.4163 113.031 77.8931 119.107C73.8035 122.023 62.8481 128.85 58.1357 129.627C56.3995 129.647 54.879 129.383 53.297 128.632C35.1567 120.017 20.5221 107.295 9.67888 90.465C-0.420754 74.7885 -0.247619 60.1373 0.122032 42.2681C0.267061 34.8411 -0.345662 26.8138 0.350517 19.5605C1.1441 18.5179 1.5839 17.9841 2.62227 17.1622C18.6966 15.2663 29.2245 12.8943 44.0103 6.55182C45.916 5.72287 47.7806 4.80324 49.598 3.79635C51.871 2.51059 54.5967 0.671971 57.054 0Z" fill="#3E7DE1"/>
      <Path d="M57.0847 5.30472C58.275 5.20826 68.9551 11.3306 71.4858 12.2933C84.1625 17.1145 96.0338 20.3306 109.643 21.7212C109.408 29.849 109.709 38.4785 109.608 46.685C109.491 56.1482 110.263 66.0032 107.058 75.1914C100.514 93.952 85.5832 108.935 68.9187 119.234C65.846 121.133 60.9277 123.442 57.6676 125.107C56.8581 125.318 54.1101 123.568 53.1709 123.095C31.8311 112.33 10.634 92.5078 5.88862 68.3002C4.67519 62.1096 4.95709 54.6633 4.96503 48.3637L5.01201 21.8411C18.7822 19.9651 31.0849 17.2522 43.9953 11.8833C48.2474 10.1148 52.7811 7.31421 57.0847 5.30472Z" fill="#EFF4FB"/>
      <Path d="M57.9143 34.1649C59.6907 34.3856 60.0747 35.0788 60.684 36.6569C62.1931 40.5647 63.1843 44.6408 64.4812 48.6168C66.3078 54.0871 68.0213 59.5944 69.62 65.1352C70.3765 67.6749 71.6367 71.5179 72.0516 74.0351C74.844 70.4896 78.4045 61.2106 80.5628 56.7476C81.3641 56.5737 82.4728 56.2636 83.2074 56.5457C85.2247 57.3201 86.7842 61.4997 87.7732 63.4696C90.8377 63.4686 94.5636 63.4036 97.556 63.6405C98.2706 64.3193 98.7398 65.0356 99.3075 65.8331C98.8422 66.5532 98.0462 67.4767 97.4899 68.163C94.9133 68.5216 87.6761 68.395 85.0321 68.1645C83.6086 66.4293 83.5138 66.0018 82.874 63.9098C79.1707 69.407 76.9532 75.7306 73.7784 81.5213C72.5601 83.7434 69.9746 83.1232 69.3347 80.884C68.5716 78.2147 67.8559 75.5211 67.0951 72.8434C64.2799 63.5242 61.0069 53.8013 58.3743 44.4669C57.9766 47.5436 56.4143 51.8156 55.4564 54.8557C54.5907 57.6033 52.93 66.3147 51.2518 68.0088C48.4542 68.5058 40.9707 68.2866 37.8504 68.3266C32.2387 68.3982 26.2351 68.3824 20.5961 68.3071C19.8249 68.1935 18.1764 68.3169 17.7162 67.6088C16.793 66.1887 16.8623 63.7515 19.0626 63.698C23.7589 63.5843 28.6654 63.3445 33.3524 63.485C38.1527 63.6288 43.6003 63.1285 48.3375 63.5856C50.841 54.6989 53.0462 45.64 55.6688 36.7767C56.1918 35.0093 56.2916 35.0033 57.9143 34.1649Z" fill="#3E7DE1"/>
    </Svg>
  ),
);

export const BioSlidersSlidersCard = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '242'}
      height={height ?? size ?? '219'}
      viewBox="0 0 242 219"
      fill="none"
      {...props}>
      <Rect width="242" height="219" rx="48" fill="#F2FAF7"/>
      <Rect x="108.126" y="69" width="27" height="81" rx="2" fill="#40B8A1"/>
      <Rect x="162.126" y="96" width="27" height="81" rx="2" transform="rotate(90 162.126 96)" fill="#40B8A1"/>
      <Path d="M75.9113 58.2004C88.1252 46.9036 104.462 40 122.411 40C158.391 40 187.892 67.7402 190.694 103" stroke="#AEE7DA" strokeWidth="5" strokeLinecap="round"/>
      <Path d="M189.692 118.359C187.574 134.861 179.474 150.639 165.708 162.157C138.113 185.246 101.411 181.5 75.4113 160" stroke="#40B8A1" strokeWidth="5" strokeLinecap="round"/>
      <Path d="M65.9114 149.5C65.9114 149.5 59.1228 145.319 54.4772 127.981C45.1649 93.2273 65.9112 69.4999 65.9112 69.4999" stroke="#40B8A1" strokeWidth="5" strokeLinecap="round"/>
    </Svg>
  ),
);

export const BioSlidersSlidersCross = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '146'}
      height={height ?? size ?? '145'}
      viewBox="0 0 146 145"
      fill="none"
      {...props}>
      <Rect x="60.1257" y="31.5" width="27" height="81" rx="2" fill="#40B8A1"/>
      <Rect x="114.126" y="58.5" width="27" height="81" rx="2" transform="rotate(90 114.126 58.5)" fill="#40B8A1"/>
      <Path d="M27.9113 20.7004C40.1252 9.40362 56.462 2.5 74.4113 2.5C110.391 2.5 139.892 30.2402 142.694 65.5" stroke="#AEE7DA" strokeWidth="5" strokeLinecap="round"/>
      <Path d="M141.692 80.8591C139.574 97.361 131.474 113.139 117.708 124.657C90.1129 147.746 53.4113 144 27.4113 122.5" stroke="#40B8A1" strokeWidth="5" strokeLinecap="round"/>
      <Path d="M17.9114 112C17.9114 112 11.1228 107.819 6.47724 90.4814C-2.83509 55.7273 17.9112 31.9999 17.9112 31.9999" stroke="#40B8A1" strokeWidth="5" strokeLinecap="round"/>
    </Svg>
  ),
);

export const BioSlidersTemperatureSliderCard = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '242'}
      height={height ?? size ?? '219'}
      viewBox="0 0 242 219"
      fill="none"
      {...props}>
      <Rect width="242" height="219" rx="48" fill="#FEF4F5"/>
      <Rect x="85" y="123" width="71" height="11" rx="5.5" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M89 123.5C89.6667 122.333 92.6667 119 93.5 111.5C94 107 93.5 89 97 83.5C100.5 78 108 70.5 120.5 70.5C133 70.5 142.5 78 145.5 86C148.5 94 147.557 111.844 148 114.5C148.5 117.5 151.5 122 153.5 123.5" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M125.031 70.7229C126.241 69.8708 127.149 68.6572 127.626 67.2565C128.103 65.8557 128.124 64.3399 127.686 62.9266C127.248 61.5132 126.373 60.2752 125.187 59.3901C124.001 58.5051 122.565 58.0186 121.085 58.0005C119.606 57.9824 118.159 58.4337 116.951 59.2895C115.744 60.1453 114.839 61.3617 114.367 62.7639C113.894 64.1661 113.878 65.682 114.321 67.0939C114.763 68.5059 115.642 69.7413 116.83 70.6227" stroke="#DA4241" strokeOpacity="0.995" strokeWidth="4"/>
      <Path d="M115.5 134C114.29 134.852 114.851 134.343 114.374 135.744C113.897 137.144 113.876 138.66 114.314 140.073C114.752 141.487 115.627 142.725 116.813 143.61C117.999 144.495 119.435 144.981 120.915 144.999C122.394 145.018 123.841 144.566 125.049 143.71C126.256 142.855 127.161 141.638 127.633 140.236C128.106 138.834 128.122 137.318 127.679 135.906C127.237 134.494 127.189 134.881 126 134" stroke="#DA4241" strokeOpacity="0.995" strokeWidth="4"/>
      <Circle cx="65" cy="83" r="7" stroke="#DA4241" strokeWidth="4"/>
      <Circle cx="177" cy="83" r="7" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M169.5 85L148.5 95" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M72.2154 84L93.0001 96" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M72 151.5L89 141" stroke="#DA4241" strokeWidth="4" strokeLinecap="round"/>
      <Path d="M171 151.5L153 141.5" stroke="#DA4241" strokeWidth="4" strokeLinecap="round"/>
      <Circle cx="65" cy="154" r="7" stroke="#DA4241" strokeWidth="4"/>
      <Circle cx="177" cy="154" r="7" stroke="#DA4241" strokeWidth="4"/>
    </Svg>
  ),
);

export const BioSlidersTemperatureSlider = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '130'}
      height={height ?? size ?? '107'}
      viewBox="0 0 130 107"
      fill="none"
      {...props}>
      <Rect x="29" y="67" width="71" height="11" rx="5.5" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M33 67.5C33.6667 66.3333 36.6667 63 37.5 55.5C38 51 37.5 33 41 27.5C44.5 22 52 14.5 64.5 14.5C77 14.5 86.5 22 89.5 30C92.5 38 91.5573 55.8441 92 58.5C92.5 61.5 95.5 66 97.5 67.5" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M69.031 14.7229C70.2407 13.8708 71.1493 12.6572 71.6263 11.2565C72.1033 9.85573 72.1242 8.33987 71.6859 6.92656C71.2476 5.51324 70.3727 4.27517 69.1868 3.39013C68.0009 2.50508 66.5651 2.0186 65.0855 2.00052C63.6059 1.98245 62.1586 2.43372 60.9515 3.28953C59.7443 4.14534 58.8395 5.36167 58.3668 6.76386C57.8941 8.16605 57.8779 9.68197 58.3205 11.0939C58.7632 12.5059 59.6418 13.7413 60.8304 14.6227" stroke="#DA4241" strokeOpacity="0.995" strokeWidth="4"/>
      <Path d="M59.5 78C58.2903 78.8521 58.8507 78.3428 58.3737 79.7435C57.8967 81.1443 57.8758 82.6601 58.3141 84.0734C58.7524 85.4868 59.6273 86.7248 60.8132 87.6099C61.9991 88.4949 63.4349 88.9814 64.9145 88.9995C66.3941 89.0176 67.8414 88.5663 69.0485 87.7105C70.2557 86.8547 71.1605 85.6383 71.6332 84.2361C72.1059 82.8339 72.1221 81.318 71.6795 79.9061C71.2368 78.4941 71.1886 78.8814 70 78" stroke="#DA4241" strokeOpacity="0.995" strokeWidth="4"/>
      <Circle cx="9" cy="27" r="7" stroke="#DA4241" strokeWidth="4"/>
      <Circle cx="121" cy="27" r="7" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M113.5 29L92.5 39" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M16.2154 28L37.0001 40" stroke="#DA4241" strokeWidth="4"/>
      <Path d="M16 95.5L33 85" stroke="#DA4241" strokeWidth="4" strokeLinecap="round"/>
      <Path d="M115 95.5L97 85.5" stroke="#DA4241" strokeWidth="4" strokeLinecap="round"/>
      <Circle cx="9" cy="98" r="7" stroke="#DA4241" strokeWidth="4"/>
      <Circle cx="121" cy="98" r="7" stroke="#DA4241" strokeWidth="4"/>
    </Svg>
  ),
);

export const BioWelcomeScreenBackgroundCircle = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '146'}
      height={height ?? size ?? '146'}
      viewBox="0 0 146 146"
      fill="none"
      {...props}>
      <Rect width="146" height="146" rx="73" fill="#0DB97A" fillOpacity="0.05"/>
      <Rect x="0.5" y="0.5" width="145" height="145" rx="72.5" stroke="#0DB97A" strokeOpacity="0.2"/>
      <Rect x="16" y="16" width="114" height="114" rx="57" fill="#0DB97A" fillOpacity="0.1"/>
      <Rect x="16.5" y="16.5" width="113" height="113" rx="56.5" stroke="#0DB97A" strokeOpacity="0.28"/>
      <Path d="M32 73C32 50.3563 50.3563 32 73 32V32C95.6437 32 114 50.3563 114 73V73C114 95.6437 95.6437 114 73 114V114C50.3563 114 32 95.6437 32 73V73Z" fill="#0DB97A" fillOpacity="0.18"/>
      <Path d="M73 32.5C95.3675 32.5 113.5 50.6325 113.5 73C113.5 95.3675 95.3675 113.5 73 113.5C50.6325 113.5 32.5 95.3675 32.5 73C32.5 50.6325 50.6325 32.5 73 32.5Z" stroke="#0DB97A" strokeOpacity="0.5"/>
      <G clipPath="url(#BioWelcomeScreenBackgroundCircle_clip0_539_1816)">
      <Path d="M73.0001 55.8096L59.4287 61.2381V72.0953C59.4287 81.1429 65.3097 87.9286 73.0001 90.1905C80.6906 87.9286 86.5716 81.1429 86.5716 72.0953V61.2381L73.0001 55.8096Z" fill="#0DB97A" fillOpacity="0.25" stroke="#0DB97A" strokeWidth="1.35714"/>
      <Path d="M63.9521 73.9047H67.1188L68.9283 69.3809L72.095 77.5237L74.3569 73.9047H82.0474" stroke="#0DB97A" strokeWidth="1.62857" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioWelcomeScreenBackgroundCircle_clip0_539_1816">
      <Rect width="36" height="38" fill="white" transform="translate(55 54)"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);

export const BioWelcomeScreenEcgWaveform = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '244'}
      height={height ?? size ?? '135'}
      viewBox="0 0 244 135"
      fill="none"
      {...props}>
      <Path d="M24.375 67.0312H60.9375L73.125 30.4688L85.3125 103.594L97.5 54.8438L109.688 67.0312H219.375" stroke="white" strokeOpacity="0.5" strokeWidth="1.82812" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M121.875 24.375L143.812 34.125V60.9375C143.812 75.5625 134.062 85.3125 121.875 90.1875C109.688 85.3125 99.9375 75.5625 99.9375 60.9375V34.125L121.875 24.375Z" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1.82812"/>
      <Path d="M113.344 57.2812L119.438 63.375L131.625 48.75" stroke="white" strokeOpacity="0.8" strokeWidth="2.4375" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M36.5625 28.0312C38.5818 28.0312 40.2188 26.3943 40.2188 24.375C40.2188 22.3557 38.5818 20.7188 36.5625 20.7188C34.5432 20.7188 32.9062 22.3557 32.9062 24.375C32.9062 26.3943 34.5432 28.0312 36.5625 28.0312Z" fill="white" fillOpacity="0.2"/>
      <Path d="M207.188 41.4375C209.88 41.4375 212.062 39.2549 212.062 36.5625C212.062 33.8701 209.88 31.6875 207.188 31.6875C204.495 31.6875 202.312 33.8701 202.312 36.5625C202.312 39.2549 204.495 41.4375 207.188 41.4375Z" fill="#15998E" fillOpacity="0.6"/>
      <Path d="M188.906 107.25C190.926 107.25 192.562 105.613 192.562 103.594C192.562 101.574 190.926 99.9375 188.906 99.9375C186.887 99.9375 185.25 101.574 185.25 103.594C185.25 105.613 186.887 107.25 188.906 107.25Z" fill="white" fillOpacity="0.2"/>
    </Svg>
  ),
);

export const BioWelcomeScreenShield = React.memo(
  ({size, width, height, ...props}: BiostasisIconProps) => (
    <Svg
      width={width ?? size ?? '36'}
      height={height ?? size ?? '38'}
      viewBox="0 0 36 38"
      fill="none"
      {...props}>
      <G clipPath="url(#BioWelcomeScreenShield_clip0_539_1823)">
      <Path d="M18.0001 1.80957L4.42871 7.23814V18.0953C4.42871 27.1429 10.3097 33.9286 18.0001 36.1905C25.6906 33.9286 31.5716 27.1429 31.5716 18.0953V7.23814L18.0001 1.80957Z" fill="#0DB97A" fillOpacity="0.25" stroke="#0DB97A" strokeWidth="1.35714"/>
      <Path d="M8.95215 19.9047H12.1188L13.9283 15.3809L17.095 23.5237L19.3569 19.9047H27.0474" stroke="#0DB97A" strokeWidth="1.62857" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
      <ClipPath id="BioWelcomeScreenShield_clip0_539_1823">
      <Rect width="36" height="38" fill="white"/>
      </ClipPath>
      </Defs>
    </Svg>
  ),
);
