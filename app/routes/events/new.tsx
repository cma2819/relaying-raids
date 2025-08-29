import { redirect } from 'react-router';
import { EventForm } from '~/concerns/events/event-form';
import { ContentContainer } from '~/concerns/common/content-container';
import z from 'zod';
import type { Route } from './+types/new';
import { authenticatedUser } from '../../concerns/auth/.server/auth';
import { createRelayEvent, isSlugAvailable } from '../../concerns/events/.server/event';
import { eventSchema } from '~/concerns/events/schemas';
import { appMeta } from '~/utils';
import { extractEventFormErrors } from '~/concerns/events/form-utils';

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

export default function New({ actionData, loaderData }: Route.ComponentProps) {
  const errors = extractEventFormErrors(actionData);

  return (
    <ContentContainer title="新しいレイドリレーを作成">
      <EventForm errors={errors} baseUrl={loaderData?.baseUrl} />
    </ContentContainer>
  );
};
