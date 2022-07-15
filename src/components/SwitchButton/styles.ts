import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  text: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 24,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default styles;
