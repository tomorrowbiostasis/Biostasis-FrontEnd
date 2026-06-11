import Toast, {ToastShowParams} from 'react-native-toast-message';

const ToastService = {
  success: (message: string, additionalPayload?: Partial<ToastShowParams>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_success',
      ...additionalPayload,
    });
  },
  error: (message: string, additionalPayload?: Partial<ToastShowParams>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_error',
      ...additionalPayload,
    });
  },
  warning: (message: string, additionalPayload?: Partial<ToastShowParams>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_warning',
      ...additionalPayload,
    });
  },
  info: (message: string, additionalPayload?: Partial<ToastShowParams>) => {
    Toast.show({
      text1: message,
      type: 'biostasis_info',
      ...additionalPayload,
    });
  },
};
export default ToastService;
