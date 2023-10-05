import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Animated, ScrollView} from 'react-native';
import Container from '~/components/Container';
import Login from './components/Login';
import Register from './components/Register';
import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useRoute, RouteProp} from '@react-navigation/core';
import {ScreensNavigationParamsList} from '~/models/Navigation.model';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppDispatch} from '~/redux/store/hooks';
import {confirmSignUp} from '~/redux/auth/thunks';
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
  const defaultTabIndex = getTabIndexByParam(`${params?.action}`);
  const swiperRef = useRef<ScrollView>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;

  const changeTab = useCallback(
    (newIndex: number, animated: boolean = true) => {
      Animated.timing(fadeIn, {
        toValue: 0.05,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setActiveTabIndex(newIndex);
        swiperRef.current?.scrollTo({
          x: newIndex * screenWidth,
          y: 0,
          animated: animated,
        });
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeIn],
  );

  useEffect(() => {
    changeTab(defaultTabIndex, false);
  }, [changeTab, defaultTabIndex]);

  useEffect(() => {
    const confirmAuth = async () => {
      if (params?.email && params?.code) {
        changeTab(0, false);

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
        setTimeout(() => {
          changeTab(defaultTabIndex, true);
        }, 100);
      }
    };
    confirmAuth();
  }, [changeTab, defaultTabIndex, dispatch, navigation, params]);

  return (
    <Container
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      safeTopArea
      type={'keyboardAvoidingScrollView'}>
      <View style={styles.panel}>
        <Text style={styles.panelHeader}>{t('auth.welcomeTo')}</Text>
        <View style={styles.panelBody}>
          <View style={styles.tabBar}>
            <Text
              style={[styles.tabItem, activeTabIndex === 0 && styles.activeTab]}
              onPress={() => changeTab(0)}>
              {t('LogIn.LogIn')}
            </Text>
            <Text
              style={[styles.tabItem, activeTabIndex === 1 && styles.activeTab]}
              onPress={() => changeTab(1)}>
              {t('signUp.signUp')}
            </Text>
          </View>
          <Animated.View style={[{opacity: fadeIn}, styles.slideContainer]}>
            {activeTabIndex === 0 ? <Login /> : <Register />}
          </Animated.View>
        </View>
      </View>
    </Container>
  );
};

export default AuthScreen;
