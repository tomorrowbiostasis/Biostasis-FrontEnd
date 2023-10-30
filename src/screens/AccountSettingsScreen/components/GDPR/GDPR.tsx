import React, {useCallback, useEffect, useState} from 'react';
import {Formik} from 'formik';
import {Button, Text, View} from 'native-base';
import {useNavigation} from '@react-navigation/core';

import {useAppDispatch, useAppSelector} from '~/redux/store/hooks';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {useEmailValidationSchema} from '~/services/Validation.service';
import {clearGdprStatus} from '~/redux/gdpr/gdpr.slice';

import {sendGDPR} from '~/redux/gdpr/thunks';
import {gdprSelector} from '~/redux/gdpr/selectors';
import Input from '~/components/Input';

import {Screens} from '~/models/Navigation.model';
import colors from '~/theme/colors';

export type GDPRScreenFormFields = {
  email: string;
};

const GDPR = () => {
  const {t} = useAppTranslation();
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const {gdprStatus} = useAppSelector(gdprSelector);
  const [isButtonSubmitted, setIsButtonSubmitted] = useState(false);

  const handleSave = useCallback(
    ({email}: {email: string}) => {
      setIsButtonSubmitted(true);
      dispatch(sendGDPR(email));
    },
    [dispatch],
  );

  useEffect(() => {
    if (gdprStatus === 'success') {
      dispatch(clearGdprStatus());
      navigate(Screens.AccountSettings as never);
    }
  }, [dispatch, gdprStatus, navigate, t]);

  return (
    <View>
      <Text fontSize={'sm'} color={colors.gray[600]}>
        {t('accountSettings.GDPR.description')}
      </Text>
      <Text fontSize={12} color={colors.red[600]} pt={2}>
        {t('accountSettings.GDPR.label')}
      </Text>
      <Formik<GDPRScreenFormFields>
        initialValues={{
          email: '',
        }}
        onSubmit={handleSave}
        validationSchema={useEmailValidationSchema()}
        validateOnChange={true}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
        }) => (
          <>
            <View marginY={5}>
              <Input
                type="email"
                label={t('profileEdit.email')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder={t('placeholder.email')}
                value={values.email}
                isValid={!errors.email && touched.email}
                errorMessage={errors.email}
              />
            </View>

            <Button
              variant={'solid'}
              disabled={!isValid || !values.email.length || isButtonSubmitted}
              onPress={() => handleSubmit()}
              borderWidth={0}
              backgroundColor={colors.green[75]}
            >
              {t('common.submit')}
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

export default GDPR;
