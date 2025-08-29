import { Card, Stack, Text, Group, Button } from '@mantine/core';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';
import { copyLiveUrl } from './url-utils';

type LivePageCardProps = {
  eventSlug: string;
  baseUrl?: string;
};

export function LivePageCard({ eventSlug, baseUrl }: LivePageCardProps) {
  const handleCopyLiveUrl = () => {
    copyLiveUrl(eventSlug, baseUrl);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={600} size="lg">ライブ配信ページ</Text>
        <Text size="sm" c="dimmed">
          視聴者がリレーの現在の配信状況をリアルタイムで確認できるページです。
        </Text>
        <Group gap="xs">
          <Button
            component={Link}
            to={`/events/${eventSlug}/live`}
            variant="filled"
            color="violet"
            size="sm"
          >
            ライブページを見る
          </Button>
          <Button
            onClick={handleCopyLiveUrl}
            variant="outline"
            color="violet"
            size="sm"
            leftSection={<DocumentDuplicateIcon className="w-4 h-4" />}
          >
            URLをコピー
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
