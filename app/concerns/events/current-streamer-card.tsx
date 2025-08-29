import { Button, Card, Stack, Text, Badge, Group } from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { Submission } from './submission';

type CurrentStreamerCardProps = {
  currentSubmission: Submission | null;
  parentDomain?: string;
};

export function CurrentStreamerCard({ currentSubmission, parentDomain }: CurrentStreamerCardProps) {
  if (!currentSubmission) {
    return (
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Stack gap="sm" align="center">
          <Text fw={500} c="gray" size="lg">まだ開始されていません</Text>
          <Text size="md" c="dimmed">リレーが開始されるまでお待ちください</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="md">
        <div>
          <Text fw={500} c="green" size="lg">現在の出番</Text>
          <Group gap="xs" mb="md">
            <Badge variant="filled" color="green">
              {currentSubmission.order}
              番目
            </Badge>
            <Text fw={500} size="lg">{currentSubmission.name}</Text>
            <Text size="md" c="dimmed">
              (@
              {currentSubmission.twitch}
              )
            </Text>
          </Group>
        </div>

        <div className="aspect-video w-full">
          <iframe
            src={`https://player.twitch.tv/?channel=${currentSubmission.twitch}&parent=${parentDomain || 'localhost'}&muted=false`}
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>

        <Button
          component="a"
          href={`https://www.twitch.tv/${currentSubmission.twitch}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="filled"
          color="violet"
          rightSection={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
        >
          Twitchで視聴する
        </Button>
      </Stack>
    </Card>
  );
}
