import React, {useCallback} from 'react';
import {Linking, View} from 'react-native';
import {Text} from 'native-base';
import Switch from '~/components/Switch';
import i18n from '~/i18n/i18n';
import styles from './styles';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';

const TermsAgree = ({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => {
  const {t} = useAppTranslation();

  const onTermsPress = useCallback(() => {
    Linking.openURL(i18n.t('drawer.termsUrl'));
  }, []);

  const onPrivacyPolicyPress = useCallback(() => {
    Linking.openURL(i18n.t('drawer.privacyUrl'));
  }, []);

  return (
    <View style={styles.container}>
      <Switch value={value} onValueChange={onValueChange} />
      <Text style={[styles.termsAgreementText, styles.termsAgreement]}>
        {`${t('termsAgree.agreeToThe')} `}
        <Text
          underline
          style={styles.termsAgreementText}
          onPress={onTermsPress}>
          {`${t('termsAgree.terms')} `}
        </Text>
        {`${t('common.and')} `}
        <Text
          underline
          style={styles.termsAgreementText}
          onPress={onPrivacyPolicyPress}>
          {`${t('termsAgree.privacyPolicy')}`}
        </Text>
        .
      </Text>
    </View>
  );
};

export default TermsAgree;
