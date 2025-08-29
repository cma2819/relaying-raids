import { redirect } from 'react-router';
import { EventForm } from '~/concerns/events/event-form';
import { ContentContainer } from '~/concerns/common/content-container';
import z from 'zod';
import type { Route } from './+types/edit';
import { authenticatedUser } from '../../concerns/auth/.server/auth';
import { getRelayEventBySlug, updateRelayEvent, isSlugAvailable } from '../../concerns/events/.server/event';
import { eventSchema } from '~/concerns/events/schemas';
import { appMeta } from '~/utils';
import { useActionNotifications } from '~/concerns/events/notification-hooks';
import { extractEventFormErrors, createEventFormInitialValues } from '~/concerns/events/form-utils';

export function meta({ loaderData }: Route.MetaArgs) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}を編集`,
    'レイドリレーを編集します',
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

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  return { user, event, baseUrl };
}

const editRelaySchema = eventSchema;

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
  const result = editRelaySchema.safeParse({
    name: formData.get('event-name'),
    slug: formData.get('event-slug'),
    submissions: JSON.parse(formData.get('submissions') as string || '[]'),
  });
  if (!result.success) {
    console.error(z.flattenError(result.error));
    return { error: z.flattenError(result.error) };
  }

  const slugAvailable = await isSlugAvailable(context, result.data.slug, existingEvent.id);
  if (!slugAvailable) {
    return {
      error: {
        fieldErrors: {
          slug: ['This slug is already in use'],
        },
      },
    };
  }

  await updateRelayEvent(context, existingEvent.id, user.id, result.data);

  return { success: true, message: 'リレーの更新が完了しました' };
}

export default function Edit({ loaderData, actionData }: Route.ComponentProps) {
  const errors = extractEventFormErrors(actionData);

  useActionNotifications(actionData, {
    successMessage: 'リレーの更新が完了しました',
    errorMessage: 'リレーの更新に失敗しました',
  });

  const initialEvent = createEventFormInitialValues(loaderData?.event);

  return (
    <ContentContainer title={`${loaderData?.event?.name || 'リレー'}を編集`}>
      <EventForm errors={errors} initialEvent={initialEvent} baseUrl={loaderData?.baseUrl} />
    </ContentContainer>
  );
};
