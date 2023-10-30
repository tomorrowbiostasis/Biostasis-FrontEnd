import React, {FC} from 'react';
import {View, Text, Image, Heading} from 'native-base';
import {ImageRequireSource, ImageStyle, StyleProp} from 'react-native';
import styles from './styles';

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
  return (
    <View style={styles.container}>
      <View style={styles.slideImageContainer}>
        <Image
          alt={'onboaring'}
          source={image}
          style={[styles.slideImage, imageStyle]}
          resizeMode={'contain'}
        />
      </View>
      <Heading size={'md'} style={styles.margin20}>
        {label}
      </Heading>
      <Text fontSize={'sm'} style={styles.margin20}>
        {text}
      </Text>
    </View>
  );
};

export default OnboardingSlide;
