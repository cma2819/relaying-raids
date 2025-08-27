import { redirect } from 'react-router';
import { ContentContainer } from '~/common/content-container';
import { Button, Card, Group, Stack, Text, Badge, Modal } from '@mantine/core';
import { Form, useNavigation, useFetcher } from 'react-router';
import { useState, useEffect } from 'react';
import { ParticipantList } from '~/events/participant-list';
import type { Route } from './+types/$slug';
import type { ShouldRevalidateFunctionArgs } from 'react-router';
import { authenticatedUser } from '../../.server/auth/auth';
import { getRelayEventBySlug, getRelayCursor, updateRelayCursor } from '../../.server/services/event';
import { executeRaid } from '../../.server/services/raid';
import { appMeta } from '~/utils';

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

type User = {
  id: string;
  login: string;
  display_name: string;
  accessToken?: string;
};

type LoaderData = {
  user: User;
  event: EventWithSubmissions;
  userSubmission: Submission;
  nextSubmission: Submission | null;
  isLastParticipant: boolean;
  isCurrentParticipant: boolean;
  currentSubmission: Submission | null;
};

export function meta({ loaderData }: { loaderData?: LoaderData }) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}の詳細`,
    'リレー参加者の詳細画面です',
  );
}

export async function loader({ context, request, params }: Route.LoaderArgs) {
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

  // ユーザーがこのイベントに参加しているかチェック
  const userSubmission = event.submissions.find(s => s.twitch === user.login);
  if (!userSubmission) {
    throw new Response('You are not participating in this event', { status: 403 });
  }

  // 次の参加者を取得
  const nextSubmission = event.submissions.find(s => s.order === userSubmission.order + 1);
  const isLastParticipant = !nextSubmission;

  // 現在のリレー進行状況を取得
  const cursor = await getRelayCursor(context, event.id);
  const isCurrentParticipant = cursor ? cursor.currentSubmissionId === userSubmission.id : false;
  const currentSubmission = cursor ? event.submissions.find(s => s.id === cursor.currentSubmissionId) : null;

  return { user, event, userSubmission, nextSubmission, isLastParticipant, isCurrentParticipant, currentSubmission };
}

export async function action({ request, context, params }: Route.ActionArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const slug = params.slug as string;
  const event = await getRelayEventBySlug(context, slug);
  if (!event) {
    throw new Response('Event not found', { status: 404 });
  }

  const userSubmission = event.submissions.find(s => s.twitch === user.login);
  if (!userSubmission) {
    throw new Response('You are not participating in this event', { status: 403 });
  }

  const nextSubmission = event.submissions.find(s => s.order === userSubmission.order + 1);
  if (!nextSubmission) {
    return { error: { message: 'You are the last participant, cannot start raid' } };
  }

  if (!user.accessToken) {
    return { error: { message: 'アクセストークンが見つかりません。再度ログインしてください。' } };
  }

  try {
    await executeRaid(
      context,
      user.accessToken,
      user.id,
      nextSubmission.twitch,
    );

    // Raid成功後、RelayCursorを次の参加者に進める
    await updateRelayCursor(
      context,
      event.id,
      nextSubmission.id,
      new Date(),
    );

    return { success: true, message: `${nextSubmission.name}へのraidを開始しました` };
  }
  catch (error) {
    console.error('Raid execution failed:', error);
    return { error: { message: 'Raidの開始に失敗しました。Twitchの認証またはAPIエラーの可能性があります。' } };
  }
}

export function shouldRevalidate({ actionResult, formMethod }: ShouldRevalidateFunctionArgs) {
  if (formMethod === 'POST' && actionResult?.success && !actionResult?.error) {
    return false;
  }
  return true;
}

export default function ParticipateEventDetail({ loaderData, actionData }: Route.ComponentProps) {
  const { event, userSubmission, nextSubmission, isLastParticipant, isCurrentParticipant, currentSubmission } = loaderData || {};
  const navigation = useNavigation();
  const skipFetcher = useFetcher();
  const isSubmitting = navigation.state === 'submitting';
  const isSkipping = skipFetcher.state === 'submitting';

  const [showRaidModal, setShowRaidModal] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setShowRaidModal(true);
    }
  }, [actionData]);

  if (!event || !userSubmission) {
    return <div>データの読み込みに失敗しました</div>;
  }

  return (
    <>
      <Modal
        opened={showRaidModal}
        onClose={() => {}}
        title="レイドを開始しました"
        closeButtonProps={{ style: { display: 'none' } }}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
      >
        <Stack gap="md">
          <Text fw={700} size="lg" c="green" ta="center">
            Twitch からレイドを完了してください
          </Text>

          {nextSubmission && (
            <Text size="sm" c="dimmed">
              Twitch 上レイドが作成されない場合は、
              <Text component="span" fw={500} c="dark">
                {' '}
                /raid
                {` ${nextSubmission.twitch}`}
                {' '}
              </Text>
              コマンドで手動でレイドを実行してください
            </Text>
          )}

          <Button
            onClick={() => window.location.reload()}
            variant="filled"
            color="blue"
            fullWidth
          >
            画面を更新
          </Button>
        </Stack>
      </Modal>

      <ContentContainer title={`${event.name}`}>
        <Stack gap="md">
          {currentSubmission
            ? (
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  {isCurrentParticipant
                    ? (
                        <Stack gap="md">
                          <Text fw={700} size="xl" c="green" ta="center">あなたの出番です！</Text>
                          <Text size="lg" c="green" fw={500} ta="center">
                            出番が終わったら、下のボタンからRaidを送ってください
                          </Text>
                          {!isLastParticipant && nextSubmission && (
                            <div>
                              <Text fw={500} mb="xs">次の参加者へRaid</Text>
                              <Group gap="xs" mb="md">
                                <Text size="sm">次の順番:</Text>
                                <Text fw={500}>
                                  {nextSubmission.name}
                                  {' '}
                                  (@
                                  {nextSubmission.twitch}
                                  )
                                </Text>
                              </Group>
                              <Form method="post">
                                <Stack gap="md">
                                  <Button
                                    type="submit"
                                    variant="filled"
                                    color="violet"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                  >
                                    {nextSubmission.name}
                                    へRaidを開始する
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    color="gray"
                                    loading={isSkipping}
                                    disabled={isSkipping}
                                    onClick={() => skipFetcher.submit({}, {
                                      method: 'post',
                                      action: `/participate/${event.slug}/skip`,
                                    })}
                                  >
                                    Raidせずに次に進める
                                  </Button>
                                  {actionData?.success && (
                                    <Text size="sm" c="green" fw={500}>
                                      ✓
                                      {' '}
                                      {actionData.message}
                                    </Text>
                                  )}
                                  {actionData?.error && (
                                    <Text size="sm" c="red" fw={500}>
                                      ✗
                                      {' '}
                                      {actionData.error.message}
                                    </Text>
                                  )}
                                  {skipFetcher.data?.error && (
                                    <Text size="sm" c="red" fw={500}>
                                      ✗
                                      {' '}
                                      {skipFetcher.data.error}
                                    </Text>
                                  )}
                                  <Text size="xs" c="dimmed">
                                    ※ Twitch APIを使用してRaidを開始します
                                  </Text>
                                </Stack>
                              </Form>
                            </div>
                          )}
                          {isLastParticipant && (
                            <Text fw={500} c="green" ta="center">
                              リレーの最後の順番のため、Raidを開始することはできません。
                            </Text>
                          )}
                        </Stack>
                      )
                    : (
                        <Stack gap="md">
                          <div>
                            <Text fw={500} c="green">現在の出番</Text>
                            <Group gap="xs">
                              <Badge variant="filled" color="green">
                                {currentSubmission.order}
                                番目
                              </Badge>
                              <Text fw={500}>{currentSubmission.name}</Text>
                              <Text size="sm" c="dimmed">
                                (@
                                {currentSubmission.twitch}
                                )
                              </Text>
                            </Group>
                          </div>
                          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe
                              src={`https://player.twitch.tv/?channel=${currentSubmission.twitch}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=false`}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                              }}
                              allowFullScreen
                            />
                          </div>
                        </Stack>
                      )}
                </Card>
              )
            : (
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Stack gap="sm" align="center">
                    <Text fw={500} c="gray">まだ開始されていません</Text>
                    <Text size="sm" c="dimmed">リレーが開始されるまでお待ちください</Text>
                  </Stack>
                </Card>
              )}

          <Card shadow="sm" padding="md" radius="md" withBorder>
            <ParticipantList
              submissions={event.submissions}
              currentSubmission={currentSubmission}
              userSubmission={userSubmission}
              variant="participate"
              renderActions={(submission) => {
                const isUser = submission.id === userSubmission.id;
                return isUser
                  ? (
                      <Badge color="blue" variant="light">あなた</Badge>
                    )
                  : null;
              }}
            />
          </Card>
        </Stack>
      </ContentContainer>
    </>
  );
}
