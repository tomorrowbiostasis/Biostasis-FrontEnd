import React, {FC, useMemo} from 'react';
import {
  View,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextStyle,
} from 'react-native';
import {Heading} from 'native-base';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {StyleProp} from 'react-native';
import Loader from '~/components/Loader';

import styles from './styles';
import {useCallback} from 'react';
import DrawerTrigger from '../DrawerTrigger';
import BackButtonTrigger from '../BackButtonTrigger';

type ContainerType = 'static' | 'scroll' | 'keyboardAvoidingScrollView';
interface ContainerProps {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeTopArea?: boolean;
  type?: ContainerType;
  disableWrapper?: boolean;
  loading?: boolean;
  titleText?: StyleProp<TextStyle>;
  showDrawerIcon?: boolean;
  showBackIcon?: boolean;
}

const Container: FC<ContainerProps> = ({
  children,
  title,
  containerStyle,
  contentContainerStyle,
  safeTopArea,
  type = 'scroll',
  disableWrapper,
  loading,
  titleText = {...styles.titleText},
  showDrawerIcon = false,
  showBackIcon = false,
}) => {
  const safeAreaEdges = useMemo<readonly Edge[]>(() => {
    const result: Edge[] = ['right', 'left'];
    if (safeTopArea) {
      result.push('top');
    }
    return result;
  }, [safeTopArea]);

  const Wrapper = useMemo(
    () => (disableWrapper ? View : SafeAreaView),
    [disableWrapper],
  );

  const ContentContainer = useCallback(
    props => {
      switch (type) {
        case 'static':
          return (
            <View style={[styles.scrollContainer, containerStyle]} {...props} />
          );
        case 'keyboardAvoidingScrollView':
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoidingContainer}
              enabled>
              <ScrollView
                bounces={false}
                contentContainerStyle={[styles.scrollContainer, containerStyle]}
                showsHorizontalScrollIndicator={false}
                {...props}
              />
            </KeyboardAvoidingView>
          );
        case 'scroll':
        default:
          return (
            <ScrollView
              bounces={false}
              contentContainerStyle={[styles.scrollContainer, containerStyle]}
              showsHorizontalScrollIndicator={false}
              {...props}
            />
          );
      }
    },
    [containerStyle, type],
  );

  return (
    <>
      <View style={styles.header}>
        {showBackIcon && <BackButtonTrigger />}
        {title && <Heading style={titleText}>{title}</Heading>}
        {showDrawerIcon && <DrawerTrigger />}
      </View>
      <Wrapper edges={safeAreaEdges} style={styles.container}>
        <ContentContainer>
          <Wrapper
            edges={['bottom']}
            style={[
              styles.contentContainer,
              contentContainerStyle,
              disableWrapper && styles.contentContainerTransparent,
            ]}>
            {children}
          </Wrapper>
        </ContentContainer>
      </Wrapper>
      {loading && (
        <View style={styles.loaderOverlay}>
          <Loader absolute />
        </View>
      )}
    </>
  );
};

export default Container;
