import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    letterSpacing: 0.8,
    color: '#5A6A7E',
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  leftIcon: {
    paddingLeft: 14,
    paddingRight: 4,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: '#E5373A',
    marginTop: 4,
  },
});

export default styles;
