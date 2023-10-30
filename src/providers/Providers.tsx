import React, {FC, ReactNode} from 'react';
import {NativeBaseProvider} from 'native-base';

import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import AuthListener from './AuthListener';
import EmergencyButton from './EmergencyCountdown';

import {store, persistor} from '~/redux/store';
import {customAppTheme} from '~/theme';
import AutomatedSystemListener from './AutomatedSystemListener';

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({children}) => (
  <Provider store={store}>
    {/* Listeners should be above PersistGate to avoid unmounting */}
    <AuthListener />
    <AutomatedSystemListener />
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <NativeBaseProvider
          theme={customAppTheme}
          config={{
            dependencies: {
              'linear-gradient': require('react-native-linear-gradient')
                .default,
            },
          }}>
          {children}
          <EmergencyButton />
        </NativeBaseProvider>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

export default Providers;
