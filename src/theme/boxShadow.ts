import colors from './colors';

// Legacy single-shadow definition preserved for back-compat with existing imports.
// New code should consume `shadow.md` from `./tokens` instead.
const boxShadow = {
  //shadow iOS
  shadowColor: colors.gray[350],
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.4,
  elevation: 4,
};

export default boxShadow;
