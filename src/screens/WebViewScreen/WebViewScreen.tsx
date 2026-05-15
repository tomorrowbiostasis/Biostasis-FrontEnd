import React, {useState} from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {RouteProp, useRoute} from '@react-navigation/native';

import ScreenHeader from '~/components/ScreenHeader';
import Loader from '~/components/Loader/Loader';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';
import styles from './styles';

/** Generic in-app browser — renders an external URL under the redesigned dark header. */
const WebViewScreen = () => {
  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'WebView'>>();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={styles.root}>
      <ScreenHeader title={params.title} />
      <View style={styles.body}>
        <WebView
          source={{uri: params.url}}
          startInLoadingState
          onLoadEnd={() => setIsLoading(false)}
          style={styles.webview}
        />
        {isLoading ? <Loader absolute /> : null}
      </View>
    </View>
  );
};

export default WebViewScreen;
