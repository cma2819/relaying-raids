import { Card, Stack, Text, Group, Button } from '@mantine/core';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { copyStreamUrl } from './url-utils';

type StreamRedirectCardProps = {
  eventSlug: string;
  baseUrl?: string;
};

export function StreamRedirectCard({ eventSlug, baseUrl }: StreamRedirectCardProps) {
  const handleCopyStreamUrl = () => {
    copyStreamUrl(eventSlug, baseUrl);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={600} size="lg">Twitch配信リダイレクト</Text>
        <Text size="sm" c="dimmed">
          現在の出番の配信者のTwitchチャンネルに直接リダイレクトするURLです。
        </Text>
        <Group gap="xs">
          <Button
            onClick={handleCopyStreamUrl}
            variant="filled"
            color="blue"
            size="sm"
            leftSection={<DocumentDuplicateIcon className="w-4 h-4" />}
          >
            リダイレクトURLをコピー
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
