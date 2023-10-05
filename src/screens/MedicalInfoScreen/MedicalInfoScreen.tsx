import {Formik, FormikErrors} from 'formik';
import {Button, Text, View} from 'native-base';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useProfileMedicalInfoValidationSchema} from '~/services/Validation.service';
import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';

import {userSelector} from '~/redux/user/selectors';
import {updateUser} from '~/redux/user/thunks';
import {IUser} from '~/redux/user/user.slice';
import {useDataValidState} from '../ProfileEditScreen/hooks/UseDataValidState';

import Container from '~/components/Container';
import Input from '~/components/Input';
import SwitchButton from '~/components/SwitchButton';

import {MaskedDateInput} from '../DateOfBirthScreen/components/MaskedDateInput/MaskedDateInput';

import styles from './styles';
import {Screens} from '~/models/Navigation.model';
import ToastService from '~/services/Toast.service';

type ProfileMedicalInfoFormFields = {
  primaryPhysician: string;
  primaryPhysicianAddress: string;
  mostRecentDiagnosis: string;
  seriousMedicalIssues?: boolean;
};

const ProfileAddMedicalInfoScreen = () => {
  const {t} = useAppTranslation();
  const dispatch = useAppDispatch();
  const {navigate} = useNavigation();
  const {user} = useAppSelector(userSelector);
  const lastHospitalVisitState = useDataValidState<string | null>(
    user.lastHospitalVisit,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSave = useCallback(
    ({
      primaryPhysician,
      primaryPhysicianAddress,
      mostRecentDiagnosis,
      seriousMedicalIssues,
    }: ProfileMedicalInfoFormFields) => {
      setIsSubmitted(true);
      const medicalIInfo: IUser = {
        primaryPhysician,
        seriousMedicalIssues: seriousMedicalIssues,
        mostRecentDiagnosis: seriousMedicalIssues ? mostRecentDiagnosis : '',
        lastHospitalVisit: seriousMedicalIssues
          ? lastHospitalVisitState.value
          : null,
        primaryPhysicianAddress,
      };
      dispatch(updateUser(medicalIInfo)).then(() => {
        navigate(Screens.ProfileDefault as never);
        ToastService.success(t('user.updatedSuccessfully'));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, lastHospitalVisitState.value, navigate],
  );

  const checkIfDisabled = (
    values: ProfileMedicalInfoFormFields,
    errors: FormikErrors<ProfileMedicalInfoFormFields>,
    isTouched?: boolean,
  ) => {
    if (isSubmitted || !isTouched) {
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
    <Container
      title={t('profileMedicalInfo.title')}
      containerStyle={styles.container}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}
      showBackIcon
      showDrawerIcon
    >
      <Formik<ProfileMedicalInfoFormFields>
        initialValues={{
          primaryPhysician: user.primaryPhysician || '',
          primaryPhysicianAddress: user.primaryPhysicianAddress || '',
          mostRecentDiagnosis: user.mostRecentDiagnosis || '',
          seriousMedicalIssues: user.seriousMedicalIssues || false,
        }}
        onSubmit={() => {}}
        validationSchema={useProfileMedicalInfoValidationSchema()}
        validateOnChange={true}
      >
        {({
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
          dirty,
          setFieldValue,
        }) => (
          <>
            <View style={styles.panel}>
              <View style={styles.panelBody}>
                <View style={styles.inputWrapper}>
                  <Input
                    type="primaryPhysician"
                    label={t('profileMedicalInfo.primaryPhysician')}
                    onChangeText={handleChange('primaryPhysician')}
                    onBlur={handleBlur('primaryPhysician')}
                    value={values.primaryPhysician}
                    errorMessage={
                      errors.primaryPhysician && touched.primaryPhysician
                        ? errors.primaryPhysician
                        : undefined
                    }
                    isValid={
                      !errors.primaryPhysician &&
                      (!!values.primaryPhysician || touched.primaryPhysician)
                    }
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Input
                    type="primaryPhysicianAddress"
                    label={t('profileMedicalInfo.primaryPhysicianAddress')}
                    onChangeText={handleChange('primaryPhysicianAddress')}
                    onBlur={handleBlur('primaryPhysicianAddress')}
                    value={values.primaryPhysicianAddress}
                    isValid={
                      !errors.primaryPhysicianAddress &&
                      (!!values.primaryPhysicianAddress ||
                        touched.primaryPhysicianAddress)
                    }
                    errorMessage={
                      errors.primaryPhysicianAddress &&
                      touched.primaryPhysicianAddress
                        ? errors.primaryPhysicianAddress
                        : undefined
                    }
                  />
                </View>
                <View style={styles.switchContainer}>
                  <SwitchButton
                    value={values.seriousMedicalIssues}
                    containerStyle={styles.switchButton}
                    onSwitchPress={async value =>
                      await setFieldValue('seriousMedicalIssues', value)
                    }
                  />
                  <Text fontSize="sm">
                    {t('profileMedicalInfo.switchLabel')}
                  </Text>
                </View>
                {values.seriousMedicalIssues && (
                  <>
                    <View style={styles.inputWrapper}>
                      <Input
                        type="mostRecentDiagnosis"
                        label={t('profileMedicalInfo.mostRecentDiagnosis')}
                        onChangeText={handleChange('mostRecentDiagnosis')}
                        onBlur={handleBlur('mostRecentDiagnosis')}
                        value={values.mostRecentDiagnosis}
                        isValid={
                          !errors.mostRecentDiagnosis &&
                          (!!values.mostRecentDiagnosis ||
                            touched.mostRecentDiagnosis)
                        }
                        errorMessage={
                          errors.mostRecentDiagnosis &&
                          touched.mostRecentDiagnosis
                            ? errors.mostRecentDiagnosis
                            : undefined
                        }
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <MaskedDateInput
                        label={t('profileMedicalInfo.lastHospitalVisit')}
                        initialValue={lastHospitalVisitState.value as string}
                        onChangeValue={lastHospitalVisitState.setValue}
                        onChangeValidation={lastHospitalVisitState.setIsValid}
                        type="maxToday"
                      />
                    </View>
                  </>
                )}
                <Button
                  variant={'solid'}
                  disabled={checkIfDisabled(values, errors, dirty)}
                  style={styles.saveButton}
                  onPress={() => handleSave(values)}
                >
                  {t('common.save')}
                </Button>
              </View>
            </View>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default ProfileAddMedicalInfoScreen;
