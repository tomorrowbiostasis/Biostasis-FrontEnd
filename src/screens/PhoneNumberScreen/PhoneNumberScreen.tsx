import React, {useCallback, useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import {Button} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';

import StepIndicator from '~/components/StepIndicator';
import {
  IPhoneNumber,
  PhoneNumberPicker,
} from '~/components/PhoneNumberPicker/PhoneNumberPicker';
import InlineCalendar from '~/components/InlineCalendar';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {updateUser} from '~/redux/user/thunks';
import {userLoading} from '~/redux/user/selectors';
import {Screens} from '~/models/Navigation.model';
import {semanticColors} from '~/theme/tokens';

import styles from './styles';

dayjs.extend(customParseFormat);

const DOB_FORMAT = 'DD/MM/YYYY';
const MIN_AGE = 18;

type DOBFormFields = {
  dateOfBirth: string;
};

export const PhoneNumberScreen = () => {
  const {t} = useAppTranslation();
  const {navigate, goBack, canGoBack} = useNavigation();
  const dispatch = useAppDispatch();
  const pending = useAppSelector(userLoading);

  const [phoneData, setPhoneData] = useState<IPhoneNumber | undefined>();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Keep schema in a single place — local to this screen since phone is local
  const dobSchema = React.useMemo(
    () =>
      Yup.object().shape({
        dateOfBirth: Yup.string()
          .required(t('validation.fieldRequired'))
          .test('dob-format', t('userDateOfBirth.invalidDate'), value => {
            if (!value) return false;
            return dayjs(value, DOB_FORMAT, true).isValid();
          })
          .test('dob-age', t('userDateOfBirth.invalidUserAge'), value => {
            if (!value) return false;
            const parsed = dayjs(value, DOB_FORMAT, true);
            if (!parsed.isValid()) return false;
            return dayjs().diff(parsed, 'year') >= MIN_AGE;
          }),
      }),
    [t],
  );

  const handleBack = useCallback(() => {
    if (canGoBack()) {
      goBack();
    }
  }, [canGoBack, goBack]);

  const handleContinuePress = useCallback(
    (values: DOBFormFields) => {
      if (!phoneData) return;
      dispatch(
        updateUser({
          phone: phoneData.phone,
          prefix: phoneData.prefix,
          countryCode: phoneData.countryCode,
          dateOfBirth: values.dateOfBirth,
        }),
        // @ts-ignore
      ).then((response: {error: string}) => {
        if (!response.error) {
          navigate(Screens.UserAddress as never);
        }
      });
    },
    [dispatch, navigate, phoneData],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <StepIndicator total={3} currentIndex={1} />
      </SafeAreaView>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <Text style={styles.eyebrow}>
          {t('signUp.steps.eyebrow', {current: 2, total: 3})}
        </Text>
        <Text style={styles.title}>{t('userPhone.combinedTitle')}</Text>
        <Text style={styles.subtitle}>
          {t('userPhone.combinedSubtitle')}
        </Text>

        <PhoneNumberPicker
          variant="figma"
          label={t('userPhone.phoneNumber')}
          onChangePhoneNumber={setPhoneData}
          onCheckIfValid={setIsPhoneValid}
        />

        <Formik<DOBFormFields>
          initialValues={{dateOfBirth: ''}}
          onSubmit={handleContinuePress}
          validationSchema={dobSchema}
          validateOnChange>
          {({
            handleSubmit,
            values,
            setFieldValue,
            setFieldTouched,
            errors,
            touched,
          }) => {
            const dobError =
              errors.dateOfBirth && touched.dateOfBirth
                ? errors.dateOfBirth
                : undefined;
            const canSubmit =
              isPhoneValid &&
              !!values.dateOfBirth &&
              !errors.dateOfBirth &&
              !pending;

            return (
              <>
                <View style={styles.dobBlock}>
                  <Text style={styles.dobLabel}>
                    {t('userDateOfBirth.label')}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setFieldTouched('dateOfBirth', true);
                      setCalendarOpen(o => !o);
                    }}
                    style={[
                      styles.dobField,
                      dobError && styles.dobFieldError,
                    ]}>
                    <Text
                      style={[
                        styles.dobValue,
                        !values.dateOfBirth && styles.dobPlaceholder,
                      ]}>
                      {values.dateOfBirth ||
                        t('userDateOfBirth.placeholder')}
                    </Text>
                    <IconMaterialCommunityIcons
                      name="calendar-blank-outline"
                      size={22}
                      color={semanticColors.info}
                    />
                  </Pressable>
                  {dobError ? (
                    <Text style={styles.dobErrorText}>{dobError}</Text>
                  ) : null}

                  {calendarOpen ? (
                    <InlineCalendar
                      value={
                        values.dateOfBirth
                          ? dayjs(values.dateOfBirth, DOB_FORMAT).toDate()
                          : null
                      }
                      maxDate={dayjs()
                        .subtract(MIN_AGE, 'year')
                        .endOf('day')
                        .toDate()}
                      onChange={d => {
                        setFieldValue(
                          'dateOfBirth',
                          dayjs(d).format(DOB_FORMAT),
                        );
                      }}
                    />
                  ) : null}
                </View>

                <View style={styles.footerRow}>
                  <Pressable
                    onPress={handleBack}
                    style={styles.backChip}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Back">
                    <Text style={styles.backGlyph}>{'‹'}</Text>
                  </Pressable>
                  <Button
                    variant={'figmaPrimary' as never}
                    flex={1}
                    isDisabled={!canSubmit}
                    isLoading={pending}
                    onPress={() => handleSubmit()}>
                    {`${t('signUp.common.next')}  →`}
                  </Button>
                </View>
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default PhoneNumberScreen;
