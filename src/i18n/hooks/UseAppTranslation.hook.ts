import {useCallback, useEffect} from 'react';
import {TFunction, useTranslation} from 'react-i18next';
import {NativeModules, Platform} from 'react-native';
import {configSelector, setLanguage} from '~/redux/config/config.slice';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';

interface IUseAppTranslationReturn {
  t: TFunction<'translation'>;
  setAppLanguage: (language: string) => void;
}

export const useAppTranslation = (): IUseAppTranslationReturn => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(configSelector).language;

  const setI18nLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
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

  useEffect(() => {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;

    setI18nLanguage(deviceLanguage);
  }, [setI18nLanguage]);

  return {
    t: t,
    setAppLanguage: setOtherLanguage,
  };
};
