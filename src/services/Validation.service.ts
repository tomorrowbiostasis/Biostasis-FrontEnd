import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import * as Yup from 'yup';

export const regex = {
  password: /^[\S]+.*[\S]+$/,
  number: /[0-9]/,
  fileName: /[ '’;:"?%#^\|{}<>€©®™°•¢£¥¶×÷π√]/g,
};

const checkUserNameRestrictions = (value: string | undefined) => {
  if (typeof value === 'string') {
    const valArray = value.split('');
    return (
      !valArray.includes('.') &&
      !value.match(regex.number) &&
      !valArray.includes('_') &&
      !valArray.includes('%') &&
      !valArray.includes('@') &&
      !valArray.includes('#')
    );
  }
  return false;
};

const useCommonValidators = () => {
  const {t} = useAppTranslation();
  return {
    password: Yup.string()
      .required(t('validation.fieldRequired'))
      .matches(regex.password, t('validation.password.whiteSpace'))
      .min(8, t('validation.password.minLength')),
    email: Yup.string()
      .email(t('validation.email.invalid'))
      .required(t('validation.fieldRequired')),
    userName: Yup.string()
      .required(t('validation.fieldRequired'))
      .test(
        'Restrictions',
        t('validation.userName.restrictions'),
        checkUserNameRestrictions,
      )
      .min(2, t('validation.userName.minLength'))
      .max(50, t('validation.userName.maxLength')),
    address: Yup.string().required('address is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    zipCode: Yup.string().required('Zip/Postal Code is required'),
    diagnosis: Yup.string().required(t('validation.fieldRequired')),
    emergencyMessage: Yup.string()
      .required(t('validation.emergencySettings.minMaxLength'))
      .min(10, t('validation.emergencySettings.minMaxLength'))
      .max(1000, t('validation.emergencySettings.minMaxLength')),
  };
};

export const useSignInValidationSchema = () => {
  const {email, password} = useCommonValidators();

  return Yup.object().shape({
    password,
    email,
  });
};

export const useSignUpValidationSchema = () => {
  const {email, password} = useCommonValidators();

  return Yup.object().shape({
    password,
    email,
    termsAccepted: Yup.boolean().oneOf([true], 'required').required(),
  });
};

export const useEmailValidationSchema = () => {
  const {email} = useCommonValidators();

  return Yup.object().shape({
    email,
  });
};

export const useConfirmPasswordValidationSchema = () => {
  const {password} = useCommonValidators();

  return Yup.object().shape({
    password,
    confirmPassword: Yup.string()
      .concat(password)
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });
};

export const useUserNameValidationSchema = () => {
  const {userName} = useCommonValidators();
  const {userName: test} = useCommonValidators();

  return Yup.object().shape({
    firstName: userName,
    lastName: test,
  });
};

export const useUserAddressValidationSchema = () => {
  const {street, country, city, zipCode} = useCommonValidators();

  return Yup.object().shape({
    street,
    country,
    city,
    zipCode,
  });
};

export const useAddNewEmergencyContactValidationSchema = () => {
  const {userName: firstName, email} = useCommonValidators();
  const {userName: lastName} = useCommonValidators();

  return Yup.object().shape({
    firstName,
    lastName,
    email,
  });
};

export const useEmergencyContactSettingsValidationSchema = () => {
  const {emergencyMessage} = useCommonValidators();
  return Yup.object().shape({
    emergencyMessage,
  });
};

export const useEditProfileValidationSchema = () => {
  const {userName: firstName, email, address} = useCommonValidators();
  const {userName: lastName} = useCommonValidators();

  return Yup.object().shape({
    firstName,
    lastName,
    email,
    address,
  });
};

export const useProfileMedicalInfoValidationSchema = () => {
  const {
    userName: primaryPhysician,
    address,
    diagnosis,
  } = useCommonValidators();

  return Yup.object().shape({
    primaryPhysician,
    primaryPhysicianAddress: address,
    mostRecentDiagnosis: diagnosis,
  });
};
