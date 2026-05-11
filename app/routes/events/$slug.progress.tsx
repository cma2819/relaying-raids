import { Link, redirect } from 'react-router';
import { ContentContainer } from '~/concerns/common/content-container';
import { Button, Group, Stack } from '@mantine/core';
import { DocumentDuplicateIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { Route } from './+types/$slug.progress';
import { authenticatedUser } from '../../concerns/auth/.server/auth';
import { getRelayEventBySlug, getRelayCursor, initializeRelayCursor, updateRelayCursor, completeEvent, isEventCompleted } from '../../concerns/events/.server/event';
import { appMeta } from '~/utils';
import { useActionNotifications } from '~/concerns/events/notification-hooks';
import { RelayProgressPanel } from '~/concerns/events/relay-progress-panel';
import { copyStreamUrl } from '~/concerns/events/url-utils';

export function meta({ loaderData }: Route.MetaArgs) {
  return appMeta(
    loaderData?.event?.name || 'リレー',
    'レイドリレーの進行状況を管理します',
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

  if (event.moderator !== user.id) {
    throw new Response('Unauthorized', { status: 403 });
  }

  let cursor = await getRelayCursor(context, event.id);
  if (!cursor) {
    await initializeRelayCursor(context, event.id);
    cursor = await getRelayCursor(context, event.id);
  }

  const currentSubmission = cursor ? event.submissions.find(s => s.id === cursor.currentSubmissionId) : null;
  const isCompleted = await isEventCompleted(context, event.id);

  return { user, event, cursor, currentSubmission, isCompleted };
}

export async function action({ request, context, params }: Route.ActionArgs) {
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

  const isCompleted = await isEventCompleted(context, existingEvent.id);
  if (isCompleted) {
    return { error: { message: '完了済みのイベントは変更できません' } };
  }

  const formData = await request.formData();
  const actionType = formData.get('actionType') as string;

  if (actionType === 'complete') {
    try {
      await completeEvent(context, existingEvent.id);
      return { success: true, message: 'レイドリレーを完了しました' };
    }
    catch {
      return { error: { message: 'レイドリレーの完了に失敗しました' } };
    }
  }

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

export default function Progress({ loaderData, actionData }: Route.ComponentProps) {
  useActionNotifications(actionData, {
    successMessage: 'リレー進行状況の更新が完了しました',
    errorMessage: 'リレー進行状況の更新に失敗しました',
  });

  const event = loaderData?.event;

  return (
    <ContentContainer title={event?.name || 'リレー'}>
      <Stack gap="md">
        <Group gap="xs">
          <Button
            onClick={() => event && copyStreamUrl(event.slug)}
            variant="light"
            color="violet"
            size="sm"
            leftSection={<DocumentDuplicateIcon className="w-4 h-4" />}
          >
            リダイレクトURLをコピー
          </Button>
          {!loaderData?.isCompleted && (
            <Button
              component={Link}
              to={`/events/${event?.slug}`}
              variant="light"
              color="blue"
              size="sm"
              leftSection={<PencilSquareIcon className="w-4 h-4" />}
            >
              編集
            </Button>
          )}
        </Group>

        {event && (
          <RelayProgressPanel
            event={event}
            currentSubmission={loaderData.currentSubmission || null}
            cursor={loaderData.cursor || null}
            isCompleted={loaderData.isCompleted || false}
          />
        )}
      </Stack>
    </ContentContainer>
  );
}
