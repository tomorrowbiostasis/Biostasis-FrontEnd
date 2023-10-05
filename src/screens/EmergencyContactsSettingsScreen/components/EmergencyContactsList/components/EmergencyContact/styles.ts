import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    marginRight: 40,
  },
  icons: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default styles;
