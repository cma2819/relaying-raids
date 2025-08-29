import { redirect } from 'react-router';
import { ContentContainer } from '~/concerns/common/content-container';
import { Stack } from '@mantine/core';
import type { Route } from './+types/$slug.progress';
import { authenticatedUser } from '../../concerns/auth/.server/auth';
import { getRelayEventBySlug, getRelayCursor, initializeRelayCursor, updateRelayCursor } from '../../concerns/events/.server/event';
import { appMeta } from '~/utils';
import { useActionNotifications } from '~/concerns/events/notification-hooks';
import { RelayProgressPanel } from '~/concerns/events/relay-progress-panel';
import { LivePageCard } from '~/concerns/events/live-page-card';

export function meta({ loaderData }: Route.MetaArgs) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}の進行状況`,
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

  return { user, event, cursor, currentSubmission };
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

export default function Progress({ loaderData, actionData }: Route.ComponentProps) {
  useActionNotifications(actionData, {
    successMessage: 'リレー進行状況の更新が完了しました',
    errorMessage: 'リレー進行状況の更新に失敗しました',
  });

  return (
    <ContentContainer title={`${loaderData?.event?.name || 'リレー'}の進行状況`}>
      <Stack gap="md">
        {loaderData?.event && (
          <LivePageCard eventSlug={loaderData.event.slug} />
        )}

        {loaderData?.event && (
          <RelayProgressPanel
            event={loaderData.event}
            currentSubmission={loaderData.currentSubmission || null}
            cursor={loaderData.cursor || null}
          />
        )}
      </Stack>
    </ContentContainer>
  );
}
