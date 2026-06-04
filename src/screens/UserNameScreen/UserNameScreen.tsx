import React, {useCallback} from 'react';
import {Keyboard, Platform, Pressable, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import FormInput from '~/components/FormInput';
import StepIndicator from '~/components/StepIndicator';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {ArrowLeftIcon} from '~/assets/icons/AppIcons';
import {semanticColors} from '~/theme/tokens';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useUserNameValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {updateUser} from '~/redux/user/thunks';
import {userLoading} from '~/redux/user/selectors';
import {Screens} from '~/models/Navigation.model';

import styles from './styles';

type NameFormFields = {
  firstName: string;
  lastName: string;
};

export const UserNameScreen = () => {
  const {t} = useAppTranslation();
  const {navigate, goBack, canGoBack} = useNavigation();
  const dispatch = useAppDispatch();
  const userNameValidationSchema = useUserNameValidationSchema();
  const pending = useAppSelector(userLoading);

  const handleBack = useCallback(() => {
    if (canGoBack()) {
      goBack();
    }
  }, [canGoBack, goBack]);

  const handleContinuePress = useCallback(
    async ({firstName, lastName}: NameFormFields) => {
      dispatch(
        updateUser({
          name: firstName,
          surname: lastName,
        }),
      );
      navigate(Screens.UserPhone as never);
    },
    [dispatch, navigate],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <StepIndicator total={3} currentIndex={0} />
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
          {t('signUp.steps.eyebrow', {current: 1, total: 3})}
        </Text>
        <Text style={styles.title}>{t('userName.title')}</Text>
        <Text style={styles.subtitle}>{t('userName.subtitle')}</Text>

        <Formik<NameFormFields>
          initialValues={{firstName: '', lastName: ''}}
          onSubmit={handleContinuePress}
          validationSchema={userNameValidationSchema}
          validateOnChange>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            dirty,
            touched,
            errors,
          }) => {
            const canSubmit = isValid && dirty && !pending;
            return (
              <>
                <View style={styles.fieldsWrap}>
                  <FormInput
                    label={t('userName.firstName')}
                    placeholder={t('userName.firstNamePlaceholder')}
                    autoCapitalize="words"
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    errorMessage={
                      errors.firstName && touched.firstName
                        ? errors.firstName
                        : undefined
                    }
                  />
                  <FormInput
                    label={t('userName.lastName')}
                    placeholder={t('userName.lastNamePlaceholder')}
                    autoCapitalize="words"
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    errorMessage={
                      errors.lastName && touched.lastName
                        ? errors.lastName
                        : undefined
                    }
                    onSubmitEditing={() => {
                      if (canSubmit) {
                        Keyboard.dismiss();
                        handleSubmit();
                      }
                    }}
                  />
                </View>

                <View style={styles.footerRow}>
                  <Pressable
                    onPress={handleBack}
                    style={styles.backChip}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Back">
                    <ArrowLeftIcon size={18} color={semanticColors.primary} />
                  </Pressable>
                  <AnimatedSubmitButton
                    variant={'figmaFormPrimary' as never}
                    style={styles.submitButton}
                    flex={1}
                    disabled={!canSubmit}
                    isLoading={pending}
                    onPress={() => handleSubmit()}>
                    {`${t('signUp.common.next')}  →`}
                  </AnimatedSubmitButton>
                </View>
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UserNameScreen;
