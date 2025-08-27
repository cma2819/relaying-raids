import { redirect } from 'react-router';
import { EventForm } from '~/events/event-form';
import { ContentContainer } from '~/common/content-container';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import z from 'zod';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import type { User } from '../../../shared/types/user';
import { authenticatedUser } from '../../.server/auth/auth';
import { getRelayEventBySlug, updateRelayEvent, isSlugAvailable } from '../../.server/services/event';
import { eventSchema } from '~/events/schemas';
import { appMeta } from '~/utils';

type EventWithSubmissions = {
  id: number;
  name: string;
  slug: string;
  moderator: string;
  submissions: Array<{
    id: number;
    eventId: number;
    name: string;
    twitch: string;
    order: number;
  }>;
};

type LoaderData = {
  user: User;
  event: EventWithSubmissions;
  baseUrl: string;
};

export function meta({ loaderData }: { loaderData?: LoaderData }) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}を編集`,
    'レイドリレーを編集します',
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

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  return { user, event, baseUrl };
}

const editRelaySchema = eventSchema;

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

type ActionData = {
  success?: boolean;
  message?: string;
  error?: {
    fieldErrors?: {
      name?: string[];
      slug?: string[];
      submissions?: string[];
    };
    message?: string;
  };
};

export default function Edit({ loaderData, actionData }: { loaderData?: LoaderData; actionData?: ActionData }) {
  const errors = actionData?.error?.fieldErrors
    ? {
        name: actionData?.error?.fieldErrors.name?.join(', '),
        slug: actionData?.error?.fieldErrors.slug?.join(', '),
        submissions: actionData.error.fieldErrors.submissions,
      }
    : undefined;

  useEffect(() => {
    if (actionData?.success) {
      notifications.show({
        title: '更新完了',
        message: actionData.message || 'リレーの更新が完了しました',
        color: 'green',
        autoClose: 5000,
      });
    }
    else if (actionData?.error) {
      notifications.show({
        title: 'エラー',
        message: actionData.error.message || 'リレーの更新に失敗しました',
        color: 'red',
        autoClose: 5000,
      });
    }
  }, [actionData]);

  const initialEvent = loaderData?.event
    ? {
        name: loaderData.event.name,
        slug: loaderData.event.slug,
        submissions: loaderData.event.submissions.map(s => ({
          name: s.name,
          twitch: s.twitch,
          order: s.order,
        })),
      }
    : undefined;

  return (
    <ContentContainer title={`${loaderData?.event?.name || 'リレー'}を編集`}>
      <EventForm errors={errors} initialEvent={initialEvent} baseUrl={loaderData?.baseUrl} />
    </ContentContainer>
  );
};
