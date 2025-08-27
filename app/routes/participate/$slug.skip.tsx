import { redirect } from 'react-router';
import type { Route } from './+types/$slug.skip';
import { authenticatedUser } from '../../.server/auth/auth';
import { getRelayEventBySlug, updateRelayCursor } from '../../.server/services/event';

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
    return { error: 'You are the last participant, cannot skip' };
  }

  try {
    await updateRelayCursor(context, event.id, nextSubmission.id, new Date());
    return { success: true, message: 'Raidせずに次に進みました' };
  }
  catch (error) {
    console.error('Failed to update relay cursor:', error);
    return { error: 'リレーの進行状況の更新に失敗しました。' };
  }
}
