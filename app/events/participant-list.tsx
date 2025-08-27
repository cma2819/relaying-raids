import { Stack, Text, Group, Badge } from '@mantine/core';
import type { ReactNode } from 'react';

type Submission = {
  id: number;
  eventId: number;
  name: string;
  twitch: string;
  order: number;
};

type ParticipantListProps = {
  submissions: Array<Submission>;
  currentSubmission?: Submission | null;
  userSubmission?: Submission | null;
  variant?: 'progress' | 'participate';
  renderActions?: (submission: Submission) => ReactNode;
};

export function ParticipantList({
  submissions,
  currentSubmission,
  userSubmission,
  variant = 'participate',
  renderActions,
}: ParticipantListProps) {
  return (
    <Stack gap="xs">
      <Text fw={500} size="sm">参加者リスト</Text>
      {submissions.map((submission) => {
        const isCurrent = currentSubmission && submission.id === currentSubmission.id;
        const isUser = userSubmission && submission.id === userSubmission.id;
        const isPast = currentSubmission && submission.order < currentSubmission.order;

        return (
          <Group key={submission.id} justify="space-between" align="center">
            <Group gap="xs">
              <Badge
                variant={
                  variant === 'progress'
                    ? (isCurrent ? 'filled' : isPast ? 'light' : 'outline')
                    : (isCurrent || isUser ? 'filled' : 'outline')
                }
                color={
                  variant === 'progress'
                    ? (isCurrent ? 'blue' : isPast ? 'gray' : 'gray')
                    : (isCurrent ? 'green' : isUser ? 'blue' : 'gray')
                }
              >
                {submission.order}
              </Badge>
              <Text
                fw={
                  variant === 'progress'
                    ? (isCurrent ? 600 : 400)
                    : (isUser ? 600 : 400)
                }
                c={variant === 'progress' && isPast ? 'dimmed' : undefined}
              >
                {submission.name}
              </Text>
              <Text size="sm" c="dimmed">
                (@
                {submission.twitch}
                )
              </Text>
            </Group>
            {renderActions && renderActions(submission)}
          </Group>
        );
      })}
    </Stack>
  );
}
