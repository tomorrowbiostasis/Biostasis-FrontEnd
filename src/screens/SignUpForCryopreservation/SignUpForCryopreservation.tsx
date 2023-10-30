/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Container from '~/components/Container';
import Loader from '~/components/Loader/Loader';
import {Screens} from '~/models/Navigation.model';
import {navigationRef} from '~/navigators';
import styles from './styles';
import colors from '~/theme/colors';
import {useTranslation} from 'react-i18next';

const SignUpForCryopreservation = () => {
  const {t, i18n} = useTranslation();
  const uri = i18n.t('signUpForTomorrow.signUpUrl');
  const [isLoading, setIsLoading] = useState(true);

  const customCSS = `
    .light-gray {
      background-color: ${colors.gray[50]} !important;
    }
    .html-embed-23{
      background-color: ${colors.gray[50]} !important;
    }
  `;

  const injectedJavaScript = `(function() {
    var style = document.createElement('style');
    style.innerHTML = \`${customCSS}\`;
    document.head.appendChild(style);
  })();`;

  const handleWebPageError = () => {
    Alert.alert(
      t('signUpForTomorrow.internetError.title'),
      t('signUpForTomorrow.internetError.description'),
      [
        {
          text: 'OK',
          onPress: () => navigationRef.navigate(Screens.Home as never),
        },
      ],
      {cancelable: false},
    );
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <Container
      title={t('signUpForTomorrow.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      showBackIcon
      showDrawerIcon
    >
      <View style={{flex: 1}}>
        <WebView
          onError={handleWebPageError}
          source={{uri}}
          injectedJavaScript={injectedJavaScript}
          startInLoadingState
          renderLoading={() => <Loader absolute={true} />}
          onLoadEnd={handleLoadEnd}
          style={
            !isLoading
              ? {flex: 1}
              : {display: 'none', backgroundColor: colors.gray[50]}
          }
        />
      </View>
    </Container>
  );
};

export default SignUpForCryopreservation;
