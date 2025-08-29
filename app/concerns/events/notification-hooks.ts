import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';

type ActionDataWithResult = {
  success?: boolean;
  message?: string;
  error?: {
    message?: string;
  } | {
    fieldErrors?: {
      [key: string]: string[] | undefined;
    };
  };
};

type NotificationMessages = {
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
};

export function useActionNotifications(
  actionData: ActionDataWithResult | undefined,
  messages: NotificationMessages = {},
) {
  const {
    successTitle = '更新完了',
    errorTitle = 'エラー',
    errorMessage = '操作に失敗しました',
  } = messages;

  useEffect(() => {
    if (actionData?.success) {
      notifications.show({
        title: successTitle,
        message: actionData.message || messages.successMessage || '更新が完了しました',
        color: 'green',
        autoClose: 5000,
      });
    }
    else if (actionData?.error) {
      const errorMsg = 'message' in actionData.error
        ? actionData.error.message || errorMessage
        : errorMessage;
      notifications.show({
        title: errorTitle,
        message: errorMsg,
        color: 'red',
        autoClose: 5000,
      });
    }
  }, [actionData, successTitle, messages.successMessage, errorTitle, errorMessage]);
}
