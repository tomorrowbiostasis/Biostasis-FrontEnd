import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Spinner} from 'native-base';

import Container from '~/components/Container';

const spinnerBoxStyle = StyleSheet.create({
  panel: {
    alignSelf: 'stretch',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

const AuthBootstrapLoading = memo(function AuthBootstrapLoading() {
  return (
    <Container
      safeTopArea
      type={'keyboardAvoidingScrollView'}>
      <View style={spinnerBoxStyle.panel}>
        <View style={spinnerBoxStyle.box}>
          <Spinner size="lg" />
        </View>
      </View>
    </Container>
  );
});

export default AuthBootstrapLoading;
