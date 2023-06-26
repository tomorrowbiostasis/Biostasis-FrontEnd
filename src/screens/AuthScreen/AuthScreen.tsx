import React, {useMemo, useRef, useEffect} from 'react';
import {Tabs} from 'native-base';
import {View, ScrollView} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/core';

import Container from '~/components/Container';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';

import Login from './components/Login';
import Register from './components/Register';
import styles from './styles';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppDispatch} from '~/redux/store/hooks';
import {confirmSignUp} from '~/redux/auth/thunks';
import {useState} from 'react';
import {useCallback} from 'react';

const screenWidth = Dimensions.get('window').width;

const getTabIndexByParam: (param: string) => number = param => {
  switch (param) {
    case 'SIGN_IN':
      return 0;
    case 'SIGN_UP':
      return 1;
    default:
      return 0;
  }
};

const AuthScreen = () => {
  const {params} =
    useRoute<RouteProp<ScreensNavigationParamsList, 'AuthScreen'>>();
  const navigation =
    useNavigation<
      StackNavigationProp<ScreensNavigationParamsList, 'AuthScreen'>
    >();
  const dispatch = useAppDispatch();
  const {t} = useAppTranslation();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const defaultTabIndex = useMemo(
    () => getTabIndexByParam(`${params?.action}`),
    [params],
  );

  const swiperRef = useRef<ScrollView>(null);

  const changeTab = useCallback(
    (newIndex: number, animated: boolean = true) => {
      setActiveTabIndex(newIndex);
      swiperRef.current?.scrollTo({
        x: newIndex * screenWidth,
        y: 0,
        animated: animated,
      });
    },
    [],
  );

  useEffect(() => {
    changeTab(defaultTabIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const confirmAuth = async () => {
      if (params?.email && params?.code) {
        changeTab(0);

        dispatch(
          confirmSignUp({
            email: params.email,
            code: params.code,
          }),
        );
        navigation.setParams({
          email: undefined,
          code: undefined,
        });
      }
    };
    confirmAuth();
  }, [changeTab, dispatch, navigation, params]);

  return (
    <Container
      title={t('auth.welcomeTo')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      safeTopArea
      type={'keyboardAvoidingScrollView'}>
      <Tabs
        isFitted
        variant={'outline'}
        onChange={changeTab}
        defaultIndex={defaultTabIndex}
        index={activeTabIndex}>
        <Tabs.Bar>
          <Tabs.Tab>{t('signIn.signIn')}</Tabs.Tab>
          <Tabs.Tab>{t('signUp.signUp')}</Tabs.Tab>
        </Tabs.Bar>
      </Tabs>
      <ScrollView ref={swiperRef} scrollEnabled={false} horizontal>
        <View key={'slide-0'} style={styles.fullWidthContainer}>
          <View style={styles.slideContainer}>
            <Login />
          </View>
        </View>
        <View key={'slide-1'} style={styles.fullWidthContainer}>
          <View style={styles.slideContainer}>
            <Register />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default AuthScreen;
