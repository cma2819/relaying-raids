import { Button, Card, Stack, Text, Badge, Group } from '@mantine/core';
import { ContentContainer } from '~/common/content-container';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { LoaderFunctionArgs } from 'react-router';
import { getRelayEventBySlug, getRelayCursor } from '../../.server/services/event';
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

type LoaderData = {
  event: EventWithSubmissions;
  currentSubmission: Submission | null;
};

export function meta({ loaderData }: { loaderData?: LoaderData }) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}の配信中`,
    'リレーの現在の配信状況をライブで確認できます',
  );
}

export async function loader({ context, params }: LoaderFunctionArgs) {
  const slug = params.slug as string;
  if (!slug) {
    throw new Response('Invalid event slug', { status: 400 });
  }

  const event = await getRelayEventBySlug(context, slug);
  if (!event) {
    throw new Response('Event not found', { status: 404 });
  }

  // 現在のリレー進行状況を取得
  const cursor = await getRelayCursor(context, event.id);
  const currentSubmission = cursor ? event.submissions.find(s => s.id === cursor.currentSubmissionId) : null;

  return { event, currentSubmission };
}

export default function EventLive({ loaderData }: { loaderData?: LoaderData }) {
  const { event, currentSubmission } = loaderData || {};

  if (!event) {
    return <div>データの読み込みに失敗しました</div>;
  }

  return (
    <ContentContainer title={`${event.name} - ライブ配信`}>
      <Stack gap="md">
        {currentSubmission
          ? (
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
            )
          : (
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Stack gap="sm" align="center">
                  <Text fw={500} c="gray" size="lg">まだ開始されていません</Text>
                  <Text size="md" c="dimmed">リレーが開始されるまでお待ちください</Text>
                </Stack>
              </Card>
            )}

        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="sm">
            <Text fw={500}>参加者リスト</Text>
            {event.submissions.map((submission: Submission) => (
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
      </Stack>
    </ContentContainer>
  );
}
