import { Stack, Paper, Text, Card, Group, Badge, Menu, ActionIcon } from '@mantine/core';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useSubmit } from 'react-router';
import { ParticipantList } from './participant-list';
import type { Submission } from './submission';

type EventWithSubmissions = {
  id: number;
  name: string;
  slug: string;
  moderator: string;
  submissions: Array<Submission>;
};

type RelayCursor = {
  eventId: number;
  currentSubmissionId: number;
  raidedAt: Date | null;
};

type RelayProgressPanelProps = {
  event: EventWithSubmissions;
  currentSubmission: Submission | null;
  cursor: RelayCursor | null;
};

export function RelayProgressPanel({
  event,
  currentSubmission,
  cursor,
}: RelayProgressPanelProps) {
  const submit = useSubmit();

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Stack gap="md">
        <Text fw={600} size="lg">リレー進行状況</Text>

        {currentSubmission
          ? (
              <Card shadow="sm" padding="sm" radius="md" withBorder bg="blue.1">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <Badge variant="filled" color="blue">現在</Badge>
                    <Text fw={500}>{currentSubmission.name}</Text>
                    <Text size="sm" c="dimmed">
                      (@
                      {currentSubmission.twitch}
                      )
                    </Text>
                    <Text size="sm" c="dimmed">
                      #
                      {currentSubmission.order}
                    </Text>
                  </Group>
                  {cursor?.raidedAt && (
                    <Badge variant="light" color="green">
                      レイド済み (
                      {new Date(cursor.raidedAt).toLocaleTimeString()}
                      )
                    </Badge>
                  )}
                </Group>
              </Card>
            )
          : (
              <Text c="dimmed">リレー進行情報を読み込み中...</Text>
            )}

        <ParticipantList
          submissions={event.submissions}
          currentSubmission={currentSubmission}
          variant="progress"
          renderActions={(submission) => {
            const isPast = currentSubmission && submission.order < currentSubmission.order;
            const isFuture = currentSubmission && submission.order > currentSubmission.order;

            if (!isPast && !isFuture) return null;

            return (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="light" color="gray" size="sm">
                    <EllipsisHorizontalIcon className="w-4 h-4" />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  {isPast && (
                    <Menu.Item
                      color="blue"
                      onClick={() => {
                        submit({
                          submissionId: submission.id.toString(),
                          markAsRaided: 'false',
                        }, { method: 'POST' });
                      }}
                    >
                      ここに戻す
                    </Menu.Item>
                  )}
                  {isFuture && (
                    <Menu.Item
                      color="orange"
                      onClick={() => {
                        submit({
                          submissionId: submission.id.toString(),
                          markAsRaided: 'true',
                        }, { method: 'POST' });
                      }}
                    >
                      ここまでスキップ
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            );
          }}
        />
      </Stack>
    </Paper>
  );
}
