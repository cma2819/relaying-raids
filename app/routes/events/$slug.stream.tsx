import type { LoaderFunctionArgs } from 'react-router';
import { getRelayEventBySlug, getRelayCursor } from '../../concerns/events/.server/event';

export async function loader({ context, params }: LoaderFunctionArgs) {
  const slug = params.slug as string;
  if (!slug) {
    throw new Response('Invalid event slug', { status: 400 });
  }

  const event = await getRelayEventBySlug(context, slug);
  if (!event) {
    throw new Response('Event not found', { status: 404 });
  }

  const cursor = await getRelayCursor(context, event.id);
  const currentSubmission = cursor ? event.submissions.find(s => s.id === cursor.currentSubmissionId) : null;

  if (!currentSubmission) {
    throw new Response('No current participant found', { status: 404 });
  }

  const twitchUrl = `https://twitch.tv/${currentSubmission.twitch}`;

  return Response.redirect(twitchUrl, 302);
}
