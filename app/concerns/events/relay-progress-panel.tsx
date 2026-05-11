import { Stack, Paper, Text, Card, Group, Badge, Menu, ActionIcon, Button } from '@mantine/core';
import { EllipsisHorizontalIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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
  isCompleted: boolean;
};

export function RelayProgressPanel({
  event,
  currentSubmission,
  cursor,
  isCompleted,
}: RelayProgressPanelProps) {
  const submit = useSubmit();

  const handleCompleteEvent = () => {
    if (confirm('このレイドリレーを完了としてマークしますか？\n完了したリレーは編集ができなくなります。')) {
      submit({ actionType: 'complete' }, { method: 'POST' });
    }
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder className={isCompleted ? 'opacity-60' : ''}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg" c={isCompleted ? 'gray' : undefined}>リレー進行状況</Text>
          {isCompleted && (
            <Badge size="lg" color="gray" variant="filled">
              完了済み
            </Badge>
          )}
        </Group>

        {currentSubmission
          ? (
              <Card shadow="sm" padding="sm" radius="md" withBorder bg={isCompleted ? 'gray.1' : 'blue.1'}>
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <Badge variant="filled" color={isCompleted ? 'gray' : 'blue'}>現在</Badge>
                    <Text fw={500} c={isCompleted ? 'gray' : undefined}>{currentSubmission.name}</Text>
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
                    <Badge variant="light" color={isCompleted ? 'gray' : 'green'}>
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
            if (isCompleted) return null;

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

        {!isCompleted && (
          <Button
            leftSection={<CheckCircleIcon className="w-5 h-5" />}
            color="green"
            variant="light"
            onClick={handleCompleteEvent}
            fullWidth
          >
            レイドリレーを完了する
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
