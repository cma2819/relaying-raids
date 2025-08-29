import { notifications } from '@mantine/notifications';

export function copyToClipboard(
  text: string,
  options: {
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
  } = {},
): void {
  const {
    successTitle = 'コピー完了',
    successMessage = 'URLをコピーしました',
    errorTitle = 'コピー失敗',
    errorMessage = 'URLのコピーに失敗しました',
  } = options;

  navigator.clipboard.writeText(text).then(() => {
    notifications.show({
      title: successTitle,
      message: successMessage,
      color: 'green',
      autoClose: 3000,
    });
  }).catch(() => {
    notifications.show({
      title: errorTitle,
      message: errorMessage,
      color: 'red',
      autoClose: 3000,
    });
  });
}

export function buildLiveUrl(slug: string, baseUrl?: string): string {
  const origin = baseUrl || window.location.origin;
  return `${origin}/events/${slug}/live`;
}

export function copyLiveUrl(slug: string, baseUrl?: string): void {
  const liveUrl = buildLiveUrl(slug, baseUrl);
  copyToClipboard(liveUrl, {
    successMessage: 'ライブ配信URLをコピーしました',
  });
}
