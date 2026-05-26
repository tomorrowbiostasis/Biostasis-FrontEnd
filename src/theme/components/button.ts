export const buttonStyles = {
  baseStyle: {
    borderRadius: 100,
    width: '100%',
    _text: {
      fontWeight: 'bold',
    },
  },
  defaultProps: {
    variant: 'solid',
    size: 'md',
  },
  variants: {
    solid: () => {
      return primaryButtonStyles;
    },
    outline: () => {
      return secondaryButtonStyles;
    },
    figmaPrimary: () => figmaPrimaryButtonStyles,
    figmaSecondary: () => figmaSecondaryButtonStyles,
    figmaEmergency: () => figmaEmergencyButtonStyles,
  },
};

export const primaryButtonStyles = {
  backgroundColor: 'gray.800',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'gray.800',
  _text: {
    color: 'gray.100',
  },
  _pressed: {
    opacity: 0.8,
  },
  _disabled: {
    backgroundColor: 'gray.500',
    borderWidth: 0,
  },
};

export const secondaryButtonStyles = {
  borderColor: 'gray.800',
  borderWidth: 3,
  _text: {
    color: 'gray.800',
  },
  _pressed: {
    opacity: 0.7,
    bg: 'gray.100',
  },
};

// Figma-aligned variants — consume semantic tokens; opt-in per call site.
export const figmaPrimaryButtonStyles = {
  backgroundColor: 'primary',
  borderWidth: 0,
  borderRadius: 14,
  minHeight: 44,
  _text: {
    color: 'textInverse',
    fontFamily: 'DMSans',
    fontWeight: '600',
  },
  _pressed: {
    backgroundColor: 'primaryPressed',
  },
  _disabled: {
    backgroundColor: 'primary',
    opacity: 0.4,
    _text: {
      color: 'textInverse',
    },
  },
  _loading: {
    backgroundColor: '#2A3647',
    opacity: 1,
    _text: {
      color: 'textInverse',
    },
    _spinner: {
      color: 'textInverse',
    },
  },
};

export const figmaSecondaryButtonStyles = {
  backgroundColor: 'surface',
  borderColor: 'primary',
  borderWidth: 1,
  borderRadius: 14,
  minHeight: 44,
  _text: {
    color: 'primary',
    fontFamily: 'DMSans',
    fontWeight: '600',
  },
  _pressed: {
    backgroundColor: 'surfaceMuted',
  },
  _disabled: {
    borderColor: 'borderStrong',
    _text: {color: 'textDisabled'},
  },
};

export const figmaEmergencyButtonStyles = {
  backgroundColor: 'dangerStrong',
  borderWidth: 0,
  borderRadius: 14,
  minHeight: 44,
  _text: {
    color: 'textInverse',
    fontFamily: 'DMSans',
    fontWeight: '700',
  },
  _pressed: {
    backgroundColor: 'danger',
  },
  _disabled: {
    opacity: 0.5,
  },
};
