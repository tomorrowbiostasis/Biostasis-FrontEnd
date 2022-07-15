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

import Container from '~/components/Container';
import Input from '~/components/Input';

import styles from './styles';

export type GDPRScreenFormFields = {
  email: string;
};

const GDPRScreen = () => {
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
      navigate('AccountSettings');
    }
  }, [dispatch, gdprStatus, navigate, t]);

  return (
    <Container
      title={t('gdpr.title')}
      contentContainerStyle={styles.contentContainer}
      type={'keyboardAvoidingScrollView'}>
      <View>
        <Text style={styles.text}>{t('gdpr.label')}</Text>
      </View>
      <Formik<GDPRScreenFormFields>
        initialValues={{
          email: '',
        }}
        onSubmit={handleSave}
        validationSchema={useEmailValidationSchema()}
        validateOnChange={true}>
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
            <View marginY={10} height={70}>
              <Input
                type="email"
                label={t('profileEdit.email')}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                isValid={!errors.email && touched.email}
                errorMessage={errors.email}
              />
            </View>

            <Button
              variant={'solid'}
              disabled={!isValid || !values.email.length || isButtonSubmitted}
              style={styles.button}
              onPress={handleSubmit}>
              {t('common.submit')}
            </Button>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default GDPRScreen;
