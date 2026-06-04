import React, {useCallback, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik, FormikErrors} from 'formik';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useProfileMedicalInfoValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {userSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';
import {IUser} from '~/redux/user/user.slice';
import {useDataValidState} from '../ProfileEditScreen/hooks/UseDataValidState';
import ToastService from '~/services/Toast.service';

import ScreenHeader from '~/components/ScreenHeader';
import FormInput from '~/components/FormInput';
import Toggle from '~/components/Toggle';
import AnimatedSubmitButton from '~/components/AnimatedSubmitButton';
import {MaskedDateInput} from '~/components/MaskedDateInput';
import styles from './styles';

type MedicalInfoFormFields = {
  primaryPhysician: string;
  primaryPhysicianAddress: string;
  mostRecentDiagnosis: string;
  seriousMedicalIssues?: boolean;
};

const ProfileAddMedicalInfoScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {goBack} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const lastHospitalVisitState = useDataValidState<string | null>(
    user.lastHospitalVisit,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSave = useCallback(
    (values: MedicalInfoFormFields) => {
      setIsSubmitted(true);
      const medicalInfo: IUser = {
        primaryPhysician: values.primaryPhysician,
        seriousMedicalIssues: values.seriousMedicalIssues,
        mostRecentDiagnosis: values.seriousMedicalIssues
          ? values.mostRecentDiagnosis
          : '',
        lastHospitalVisit: values.seriousMedicalIssues
          ? lastHospitalVisitState.value
          : null,
        primaryPhysicianAddress: values.primaryPhysicianAddress,
      };
      // @ts-ignore - thunk dispatch typing
      dispatch(updateUser(medicalInfo)).then((response: {error: string}) => {
        setIsSubmitted(false);
        if (!response.error) {
          ToastService.success(t('user.updatedSuccessfully'));
          goBack();
        }
      });
    },
    [dispatch, lastHospitalVisitState.value, goBack, t],
  );

  const checkIfDisabled = (
    values: MedicalInfoFormFields,
    errors: FormikErrors<MedicalInfoFormFields>,
  ) => {
    if (isSubmitted) {
      return true;
    }
    if (values.seriousMedicalIssues) {
      return !(
        !!values.primaryPhysician &&
        !!values.primaryPhysicianAddress &&
        !!values.mostRecentDiagnosis &&
        !!lastHospitalVisitState.value &&
        !errors.primaryPhysician &&
        !errors.primaryPhysicianAddress &&
        !errors.mostRecentDiagnosis &&
        lastHospitalVisitState.isValid
      );
    }
    return !(
      !!values.primaryPhysician &&
      !!values.primaryPhysicianAddress &&
      !errors.primaryPhysician &&
      !errors.primaryPhysicianAddress
    );
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title={t('medicalInfoScreen.title')} />
      <Formik<MedicalInfoFormFields>
        initialValues={{
          primaryPhysician: user.primaryPhysician || '',
          primaryPhysicianAddress: user.primaryPhysicianAddress || '',
          mostRecentDiagnosis: user.mostRecentDiagnosis || '',
          seriousMedicalIssues: user.seriousMedicalIssues || false,
        }}
        onSubmit={handleSave}
        validationSchema={useProfileMedicalInfoValidationSchema()}
        validateOnChange>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          setFieldValue,
        }) => (
          <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            enableOnAndroid
            extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Text style={styles.intro}>{t('medicalInfoScreen.intro')}</Text>

            <FormInput
              label={t('medicalInfoScreen.physicianName')}
              placeholder={t('medicalInfoScreen.physicianNamePlaceholder')}
              value={values.primaryPhysician}
              onChangeText={handleChange('primaryPhysician')}
              onBlur={handleBlur('primaryPhysician')}
              errorMessage={
                errors.primaryPhysician && touched.primaryPhysician
                  ? errors.primaryPhysician
                  : undefined
              }
            />
            <FormInput
              label={t('medicalInfoScreen.physicianAddress')}
              placeholder={t('medicalInfoScreen.physicianAddressPlaceholder')}
              value={values.primaryPhysicianAddress}
              onChangeText={handleChange('primaryPhysicianAddress')}
              onBlur={handleBlur('primaryPhysicianAddress')}
              errorMessage={
                errors.primaryPhysicianAddress &&
                touched.primaryPhysicianAddress
                  ? errors.primaryPhysicianAddress
                  : undefined
              }
            />

            <Text style={styles.sectionLabel}>
              {t('medicalInfoScreen.medicalHistory')}
            </Text>
            <View style={styles.toggleCard}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>
                  {t('medicalInfoScreen.seriousQuestion')}
                </Text>
                <Text style={styles.toggleHint}>
                  {t('medicalInfoScreen.seriousHint')}
                </Text>
              </View>
              <Toggle
                value={!!values.seriousMedicalIssues}
                onChange={value => setFieldValue('seriousMedicalIssues', value)}
              />
            </View>

            {values.seriousMedicalIssues ? (
              <>
                <FormInput
                  label={t('medicalInfoScreen.diagnosis')}
                  placeholder={t('medicalInfoScreen.diagnosisPlaceholder')}
                  value={values.mostRecentDiagnosis}
                  onChangeText={handleChange('mostRecentDiagnosis')}
                  onBlur={handleBlur('mostRecentDiagnosis')}
                  errorMessage={
                    errors.mostRecentDiagnosis && touched.mostRecentDiagnosis
                      ? errors.mostRecentDiagnosis
                      : undefined
                  }
                />
                <MaskedDateInput
                  label={t('medicalInfoScreen.lastVisit')}
                  initialValue={lastHospitalVisitState.value as string}
                  onChangeValue={lastHospitalVisitState.setValue}
                  onChangeValidation={lastHospitalVisitState.setIsValid}
                  type="maxToday"
                />
              </>
            ) : null}

            <AnimatedSubmitButton
              mt={4}
              disabled={checkIfDisabled(values, errors)}
              isLoading={isSubmitted}
              onPress={() => handleSubmit()}>
              {t('profileUserData.save')}
            </AnimatedSubmitButton>
          </KeyboardAwareScrollView>
        )}
      </Formik>
    </View>
  );
};

export default ProfileAddMedicalInfoScreen;
