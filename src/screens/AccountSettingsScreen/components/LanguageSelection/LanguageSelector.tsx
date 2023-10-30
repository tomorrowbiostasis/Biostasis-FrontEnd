import React, {useCallback, useEffect, useState} from 'react';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {Select, Text, View} from 'native-base';
import {AsyncStorageService} from '~/services/AsyncStorage.service/AsyncStorage.service';
import {Language, Languages} from '~/constants/language.constants';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import colors from '~/theme/colors';
import styles from './styles';
import {Settings} from 'react-native';
import {isAndroid} from '~/utils';

const LanguageSelector = () => {
  const {t, setAppLanguage} = useAppTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const fetchLanguage = async () => {
      const language = await AsyncStorageService.getItem(
        AsyncStorageEnum.Language,
      );
      language && setSelectedLanguage(language);
    };

    fetchLanguage();
  }, []);

  const changeLanguage = useCallback(
    async (language: string) => {
      isAndroid
        ? await AsyncStorageService.setItem(AsyncStorageEnum.Language, language)
        : Settings.set({'@language': language});
      setSelectedLanguage(language);
      setAppLanguage(language);
    },
    [setAppLanguage],
  );

  return (
    <View style={styles.languageSection}>
      <Text fontSize={'md'}>{t('languages.title')}</Text>
      <Select
        minWidth={'100%'}
        selectedValue={selectedLanguage}
        onValueChange={changeLanguage}
        accessibilityLabel={t(
          'emergencyContactsSettings.automatedEmergencySettings.interval.title',
        )}
        _selectedItem={{
          bg: colors.blue[300],
        }}
        mt={2}
      >
        {(Languages as Language[]).map(({name, code, flag}) => (
          <Select.Item
            key={code}
            label={t(`languages.${name}`) + ' ' + flag}
            value={code}
          />
        ))}
      </Select>
    </View>
  );
};

export default LanguageSelector;
