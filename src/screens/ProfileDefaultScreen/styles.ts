import {Dimensions, StyleSheet} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const height = screenHeight / 2.7;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  infoContainer: {
    height: height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  progressCircle: {
    height: height,
  },
});

export default styles;
