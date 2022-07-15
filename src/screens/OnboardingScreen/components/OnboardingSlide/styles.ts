import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  header: {
    textTransform: 'uppercase',
  },
  slideImageContainer: {
    width: '100%',
    maxHeight: '50%',
    flex: 1,
  },
  slideImage: {
    width: screenWidth - 120,
    flex: 1,
    alignSelf: 'center',
  },
  margin40: {
    marginTop: 40,
  },
});

export default styles;
