import Toast, {ToastProps} from 'react-native-toast-message';

const ToastService = {
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
  warning: (message: string, additionalPayload?: Partial<ToastProps>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_warning',
      ...additionalPayload,
    });
  },
};
export default ToastService;
