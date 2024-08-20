import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import {TFunction, useTranslation} from 'react-i18next';
import {Settings} from 'react-native';
import {configSelector, setLanguage} from '~/redux/config/config.slice';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {AsyncStorageEnum} from '~/services/AsyncStorage.service/AsyncStorage.types';
import {isAndroid} from '~/utils';

interface IUseAppTranslationReturn {
  t: TFunction<'translation'>;
  setAppLanguage: (language: string) => void;
}

export const useAppTranslation = (): IUseAppTranslationReturn => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(configSelector).language;

  //TODO: Create a bridge to use AsyncStorage with native code (swift)
  const setI18nLanguage = useCallback(
    async (language: string) => {
      i18n.changeLanguage(language);
      isAndroid
        ? await AsyncStorage.setItem(AsyncStorageEnum.Language, language)
        : Settings.set({'@language': language});
    },
    [i18n],
  );

  const setOtherLanguage = useCallback(
    (lang: string) => {
      if (lang !== currentLanguage) {
        dispatch(setLanguage(lang));
        setI18nLanguage(lang);
      }
    },
    [currentLanguage, dispatch, setI18nLanguage],
  );

  return {
    t: t,
    setAppLanguage: setOtherLanguage,
  };
};
