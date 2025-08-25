import { authenticatedUser } from '~/auth/auth.server';
import { redirect } from 'react-router';
import { EventForm } from '~/events/event-form';
import { Paper } from '~/common/paper';
import { Head } from '~/common/head';
import * as schema from "../../../database/schema";
import z from 'zod';
import type { Route } from './+types/new';
import chunk from 'lodash.chunk';

export function meta() {
  return [
    { title: 'リレーをつくる' },
    { name: 'description', content: '新しくレイドリレーをつくります' },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }
  return { user };
}

const submissionsSchema = z.object({
  name: z.string(),
  twitch: z.string().min(3),
}); 

const newRelaySchema = z.object({
  name: z.string().min(3),
  submissions: z.array(submissionsSchema).min(1),
});

export async function action({ request, context }: Route.ActionArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const formData = await request.formData();
  const result = newRelaySchema.safeParse({
    name: formData.get('event-name'),
    submissions: JSON.parse(formData.get('submissions') as string || '[]'),
  });
  if (!result.success) {
    console.error(z.flattenError(result.error));
    return { error: z.flattenError(result.error)};
  }

  const [createdEvent] = await context.db.insert(schema.relayEvents).values({
    name: result.data.name,
    moderator: user.id,
  }).returning();

  const chunkedSubmissions = chunk(result.data.submissions, 20);

  for (const chunk of chunkedSubmissions) {
    await context.db.insert(schema.relaySubmissions).values(
      chunk.map(submission => ({
        eventId: createdEvent.id,
        name: submission.name,
        twitch: submission.twitch,
      }))
    );
  }

  throw redirect('/');
}

export default function New({ actionData }: Route.ComponentProps) {
  const errors = actionData?.error ? {
    name: actionData?.error?.fieldErrors.name?.join(', '),
    submissions: actionData.error.fieldErrors.submissions,
  } : undefined;

  return (
    <div className='flex flex-col items-center gap-2'>
      <Paper>
        <Head level='h2'>新しいレイドリレーを作成</Head>
        <EventForm errors={errors} />
      </Paper>
    </div>
  );
};
