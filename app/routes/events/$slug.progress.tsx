import { redirect } from 'react-router';
import { ContentContainer } from '~/common/content-container';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { Stack, Card, Text, Badge, Group, Paper, Button, Menu, ActionIcon } from '@mantine/core';
import { DocumentDuplicateIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { Link, useSubmit } from 'react-router';
import { ParticipantList } from '~/events/participant-list';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import type { User } from '../../../shared/types/user';
import { authenticatedUser } from '../../.server/auth/auth';
import { getRelayEventBySlug, getRelayCursor, initializeRelayCursor, updateRelayCursor } from '../../.server/services/event';
import { appMeta } from '~/utils';
import type { RelayCursor } from '~/events/event';

type Submission = {
  id: number;
  eventId: number;
  name: string;
  twitch: string;
  order: number;
};

type EventWithSubmissions = {
  id: number;
  name: string;
  slug: string;
  moderator: string;
  submissions: Array<Submission>;
};

type LoaderData = {
  user: User;
  event: EventWithSubmissions;
  cursor: RelayCursor | null;
  currentSubmission: Submission | null;
};

export function meta({ loaderData }: { loaderData?: LoaderData }) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}の進行状況`,
    'レイドリレーの進行状況を管理します',
  );
}

export async function loader({ context, request, params }: LoaderFunctionArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const slug = params.slug as string;
  if (!slug) {
    throw new Response('Invalid event slug', { status: 400 });
  }

  const event = await getRelayEventBySlug(context, slug);
  if (!event) {
    throw new Response('Event not found', { status: 404 });
  }

  if (event.moderator !== user.id) {
    throw new Response('Unauthorized', { status: 403 });
  }

  let cursor = await getRelayCursor(context, event.id);
  if (!cursor) {
    await initializeRelayCursor(context, event.id);
    cursor = await getRelayCursor(context, event.id);
  }

  const currentSubmission = cursor ? event.submissions.find(s => s.id === cursor.currentSubmissionId) : null;

  return { user, event, cursor, currentSubmission };
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const slug = params.slug as string;
  if (!slug) {
    throw new Response('Invalid event slug', { status: 400 });
  }

  const existingEvent = await getRelayEventBySlug(context, slug);
  if (!existingEvent) {
    throw new Response('Event not found', { status: 404 });
  }

  if (existingEvent.moderator !== user.id) {
    throw new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();
  const submissionId = parseInt(formData.get('submissionId') as string);
  const markAsRaided = formData.get('markAsRaided') === 'true';

  try {
    await updateRelayCursor(
      context,
      existingEvent.id,
      submissionId,
      markAsRaided ? new Date() : undefined,
    );
    return { success: true, message: 'リレー進行状況を更新しました' };
  }
  catch {
    return { error: { message: 'リレー進行状況の更新に失敗しました' } };
  }
}

type ActionData = {
  success?: boolean;
  message?: string;
  error?: {
    message?: string;
  };
};

function RelayProgressPanel({
  event,
  currentSubmission,
  cursor,
}: {
  event: EventWithSubmissions;
  currentSubmission: Submission | null;
  cursor: RelayCursor | null;
}) {
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

export default function Progress({ loaderData, actionData }: { loaderData?: LoaderData; actionData?: ActionData }) {
  useEffect(() => {
    if (actionData?.success) {
      notifications.show({
        title: '更新完了',
        message: actionData.message || 'リレー進行状況の更新が完了しました',
        color: 'green',
        autoClose: 5000,
      });
    }
    else if (actionData?.error) {
      notifications.show({
        title: 'エラー',
        message: actionData.error.message || 'リレー進行状況の更新に失敗しました',
        color: 'red',
        autoClose: 5000,
      });
    }
  }, [actionData]);

  const handleCopyLiveUrl = () => {
    const liveUrl = `${window.location.origin}/events/${loaderData?.event?.slug}/live`;
    navigator.clipboard.writeText(liveUrl).then(() => {
      notifications.show({
        title: 'コピー完了',
        message: 'ライブ配信URLをコピーしました',
        color: 'green',
        autoClose: 3000,
      });
    }).catch(() => {
      notifications.show({
        title: 'コピー失敗',
        message: 'URLのコピーに失敗しました',
        color: 'red',
        autoClose: 3000,
      });
    });
  };

  return (
    <ContentContainer title={`${loaderData?.event?.name || 'リレー'}の進行状況`}>
      <Stack gap="md">
        {loaderData?.event && (
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="md">
              <Text fw={600} size="lg">ライブ配信ページ</Text>
              <Text size="sm" c="dimmed">
                視聴者がリレーの現在の配信状況をリアルタイムで確認できるページです。
              </Text>
              <Group gap="xs">
                <Button
                  component={Link}
                  to={`/events/${loaderData.event.slug}/live`}
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
        )}

        {loaderData?.event && (
          <RelayProgressPanel
            event={loaderData.event}
            currentSubmission={loaderData.currentSubmission}
            cursor={loaderData.cursor}
          />
        )}
      </Stack>
    </ContentContainer>
  );
}
