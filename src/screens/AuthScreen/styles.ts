import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  contentContainer: {
    paddingHorizontal: 0,
  },
  slideContainer: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  fullWidthContainer: {
    width: screenWidth,
  },
});

export default styles;
