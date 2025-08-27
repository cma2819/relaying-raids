import { redirect } from 'react-router';
import { EventForm } from '~/events/event-form';
import { ContentContainer } from '~/common/content-container';
import z from 'zod';
import type { Route } from './+types/new';
import type { User } from '../../../shared/types/user';
import { authenticatedUser } from '../../.server/auth/auth';
import { createRelayEvent, isSlugAvailable } from '../../.server/services/event';
import { eventSchema } from '~/events/schemas';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('レイドリレーをつくる', '新しくレイドリレーをつくります');
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  return { user, baseUrl };
}

const newRelaySchema = eventSchema;

export async function action({ request, context }: Route.ActionArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const formData = await request.formData();
  const result = newRelaySchema.safeParse({
    name: formData.get('event-name'),
    slug: formData.get('event-slug'),
    submissions: JSON.parse(formData.get('submissions') as string || '[]'),
  });
  if (!result.success) {
    console.error(z.flattenError(result.error));
    return { error: z.flattenError(result.error) };
  }

  const slugAvailable = await isSlugAvailable(context, result.data.slug);
  if (!slugAvailable) {
    return {
      error: {
        fieldErrors: {
          slug: ['This slug is already in use'],
        },
      },
    };
  }

  await createRelayEvent(context, user.id, result.data);

  throw redirect('/events');
}

type ActionData = {
  error?: {
    fieldErrors?: {
      name?: string[];
      slug?: string[];
      submissions?: string[];
    };
  };
};

export default function New({ actionData, loaderData }: { actionData?: ActionData; loaderData?: { user: User; baseUrl: string } }) {
  const errors = actionData?.error?.fieldErrors
    ? {
        name: actionData.error.fieldErrors.name?.join(', '),
        slug: actionData.error.fieldErrors.slug?.join(', '),
        submissions: actionData.error.fieldErrors.submissions,
      }
    : undefined;

  return (
    <ContentContainer title="新しいレイドリレーを作成">
      <EventForm errors={errors} baseUrl={loaderData?.baseUrl} />
    </ContentContainer>
  );
};
