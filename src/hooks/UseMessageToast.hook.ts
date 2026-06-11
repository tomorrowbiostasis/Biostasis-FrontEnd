import {useEffect, useRef} from 'react';
import {useAppTranslation} from '~/i18n/hooks/UseAppTranslation.hook';
import {IAlertMessage} from '~/models/Message.model';
import ToastService from '~/services/Toast.service';

const TOAST_VISIBILITY_MS = 3600;

export const useMessageToast = (message?: IAlertMessage) => {
  const {t} = useAppTranslation();
  const lastMessageRef = useRef<string | undefined>();

  useEffect(() => {
    if (!message) {
      lastMessageRef.current = undefined;
      return;
    }

    const messageId = `${message.success ? 'success' : 'error'}:${
      message.messageKey
    }`;

    if (lastMessageRef.current === messageId) {
      return;
    }

    lastMessageRef.current = messageId;
    const notify = message.success ? ToastService.success : ToastService.error;

    notify(t(message.messageKey), {visibilityTime: TOAST_VISIBILITY_MS});
  }, [message, t]);
};
