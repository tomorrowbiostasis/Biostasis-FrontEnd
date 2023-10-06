import React from 'react';
import Toast, {BaseToast} from 'react-native-toast-message';
import colors from './colors';
import {StyleSheet} from 'react-native';

export const toastConfig = {
  biostasis_success: ({text1}: {text1: string}) => (
    <BaseToast
      text1={text1}
      style={{
        ...styles.main,
        borderLeftColor: colors.green[200],
        backgroundColor: colors.green[200],
      }}
      contentContainerStyle={styles.container}
      onTrailingIconPress={() => Toast.hide()}
      text1Style={styles.text1}
      text1NumberOfLines={4}
      text2NumberOfLines={0}
    />
  ),
  biostasis_error: ({text1}: {text1: string}) => (
    <BaseToast
      text1={text1}
      style={{
        ...styles.main,
        borderLeftColor: colors.red[200],
        backgroundColor: colors.red[200],
      }}
      contentContainerStyle={styles.container}
      onTrailingIconPress={() => Toast.hide()}
      text1Style={styles.text1}
      text1NumberOfLines={4}
      text2NumberOfLines={0}
    />
  ),
  biostasis_warning: ({text1}: {text1: string}) => (
    <BaseToast
      text1="Warning"
      text2={text1}
      style={{
        ...styles.main,
        borderLeftColor: colors.yellow[600],
        backgroundColor: colors.yellow[600],
      }}
      contentContainerStyle={styles.container}
      onTrailingIconPress={() => Toast.hide()}
      text2Style={styles.text1}
      text1Style={styles.text2}
      text1NumberOfLines={1}
      text2NumberOfLines={4}
    />
  ),
};

const styles = StyleSheet.create({
  main: {
    height: undefined,
    padding: 5,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.white,
    textAlign: 'center',
  },
  text2: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});
