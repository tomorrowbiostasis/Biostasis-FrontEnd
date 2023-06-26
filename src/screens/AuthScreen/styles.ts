import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  contentContainer: {
    paddingHorizontal: 0,
  },
  slideContainer: {
    paddingHorizontal: 30,
    marginTop: 60,
  },
  fullWidthContainer: {
    width: screenWidth,
  },
});

export default styles;
