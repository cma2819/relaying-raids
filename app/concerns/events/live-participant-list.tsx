import { Card, Stack, Text, Badge, Group } from '@mantine/core';
import type { Submission } from './submission';

type LiveParticipantListProps = {
  submissions: Submission[];
  currentSubmission: Submission | null;
};

export function LiveParticipantList({ submissions, currentSubmission }: LiveParticipantListProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="sm">
        <Text fw={500}>参加者リスト</Text>
        {submissions.map((submission: Submission) => (
          <Group key={submission.id} justify="space-between">
            <Group gap="xs">
              <Badge
                variant={
                  currentSubmission && submission.id === currentSubmission.id
                    ? 'filled'
                    : 'outline'
                }
                color={
                  currentSubmission && submission.id === currentSubmission.id
                    ? 'green'
                    : 'gray'
                }
              >
                {submission.order}
              </Badge>
              <Text fw={currentSubmission && submission.id === currentSubmission.id ? 600 : 400}>
                {submission.name}
              </Text>
              <Text size="sm" c="dimmed">
                (@
                {submission.twitch}
                )
              </Text>
            </Group>
            {currentSubmission && submission.id === currentSubmission.id && (
              <Badge color="green" variant="light">配信中</Badge>
            )}
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
