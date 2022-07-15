import React, {FC} from 'react';
import {View, Text, Image, Heading} from 'native-base';
import {ImageRequireSource, ImageStyle, StyleProp} from 'react-native';

import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

type OnboardingSlideProps = {
  image: ImageRequireSource;
  label: string;
  text: string;
  imageStyle?: StyleProp<ImageStyle>;
};

const OnboardingSlide: FC<OnboardingSlideProps> = ({
  image,
  label,
  text,
  imageStyle,
}) => {
  const {t} = useAppTranslation();

  return (
    <View style={styles.container}>
      <Heading size="xl" style={styles.header}>
        {t('appName')}
      </Heading>
      <View style={styles.slideImageContainer}>
        <Image
          alt={'onboaring'}
          source={image}
          style={[styles.slideImage, imageStyle]}
          resizeMode={'contain'}
        />
      </View>
      <Heading size={'xl'} style={styles.margin40}>
        {label}
      </Heading>
      <Text fontSize={'lg'} style={styles.margin40}>
        {text}
      </Text>
    </View>
  );
};

export default OnboardingSlide;
