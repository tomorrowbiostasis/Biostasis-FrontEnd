export const inputStyles = {
  baseStyle: {
    borderColor: 'gray.200',
    borderRadius: 3,
    color: 'dark.400',
    _light: {
      placeholderTextColor: 'gray.650',
    },
    _dark: {
      placeholderTextColor: 'gray.650',
    },
    _android: {
      _focus: {
        borderColor: 'gray.400',
      },
    },
    _ios: {
      _focus: {
        borderColor: 'gray.400',
      },
    },
    _invalid: {
      borderColor: 'red.400',
    },
  },

  variants: {
    underlined: () => underlinedInputVariantStyles,
    figma: () => figmaInputVariantStyles,
  },
  defaultProps: {
    selectionColor: 'blue.600',
  },
};

// Figma-aligned input variant — pill border, subtle bg, DM Sans text.
// State styling: pass `isInvalid` for error; success/warning are handled by
// the FormField wrapper's helper text + caller-provided border color overrides.
const figmaInputVariantStyles = {
  backgroundColor: 'surface',
  borderColor: 'border',
  borderWidth: 1,
  borderRadius: 14,
  color: 'textPrimary',
  paddingX: 4,
  fontFamily: 'DMSans',
  fontWeight: '400',
  _light: {
    placeholderTextColor: 'textMuted',
  },
  _dark: {
    placeholderTextColor: 'textMuted',
  },
  _android: {
    _focus: {borderColor: 'borderStrong'},
  },
  _ios: {
    _focus: {borderColor: 'borderStrong'},
  },
  _invalid: {
    borderColor: 'danger',
    backgroundColor: 'dangerSurface',
  },
  _disabled: {
    backgroundColor: 'surfaceMuted',
    borderColor: 'border',
    _text: {color: 'textDisabled'},
  },
};

const underlinedInputVariantStyles = {
  borderBottomWidth: 2,
  borderColor: 'blue.200',
  height: 41,
  color: 'gray.800',
  _android: {
    p: 0,
    _focus: {
      borderColor: 'blue.400',
    },
  },
  _ios: {
    p: 0,
    _focus: {
      borderColor: 'blue.400',
    },
  },
  _invalid: {
    borderColor: 'red.200',
  },
};
