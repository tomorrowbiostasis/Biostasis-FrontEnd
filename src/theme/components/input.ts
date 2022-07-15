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
  },
  defaultProps: {
    selectionColor: 'blue.600',
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
