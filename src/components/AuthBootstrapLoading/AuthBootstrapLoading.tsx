import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Spinner} from 'native-base';

import Container from '~/components/Container';
import authScreenStyles from '~/screens/AuthScreen/styles';

const spinnerBoxStyle = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

const AuthBootstrapLoading = memo(function AuthBootstrapLoading() {
  return (
    <Container
      containerStyle={authScreenStyles.container}
      contentContainerStyle={authScreenStyles.contentContainer}
      safeTopArea
      type={'keyboardAvoidingScrollView'}>
      <View style={authScreenStyles.panel}>
        <View style={[authScreenStyles.panelBody, spinnerBoxStyle.box]}>
          <Spinner size="lg" />
        </View>
      </View>
    </Container>
  );
});

export default AuthBootstrapLoading;
