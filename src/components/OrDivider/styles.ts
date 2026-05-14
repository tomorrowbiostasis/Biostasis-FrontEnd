import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.1)',
  },
  label: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    color: '#96A3B3',
  },
});

export default styles;
