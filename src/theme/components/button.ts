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
