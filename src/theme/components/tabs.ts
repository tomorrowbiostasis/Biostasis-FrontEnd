export const tabsStyles = {
  variants: {
    outline: () => outlineTabsVariantStyles,
  },
};

const outlineTabsVariantStyles = {
  tabBarStyle: {
    borderBottomWidth: 0,
  },
  activeTabStyle: {
    borderColor: 'gray.700',
    borderBottomWidth: 1,
    _text: {
      color: 'gray.700',
      fontWeight: 500,
      letterSpacing: 0.4,
      textTransform: 'capitalize',
    },
  },
  inactiveTabStyle: {
    borderColor: 'gray.300',
    borderBottomWidth: 1,
    _text: {
      color: 'gray.625',
      fontWeight: 500,
      letterSpacing: 0.4,
      textTransform: 'capitalize',
    },
  },
};
