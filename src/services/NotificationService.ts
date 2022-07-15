import Toast, {ToastProps} from 'react-native-toast-message';

const NotificationService = {
  success: (message: string, additionalPayload?: Partial<ToastProps>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_success',
      ...additionalPayload,
    });
  },
  error: (message: string, additionalPayload?: Partial<ToastProps>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_error',
      ...additionalPayload,
    });
  },
};
export default NotificationService;
