import type { Route } from './+types/$slug.live';
import { getRelayEventBySlug, getRelayCursor } from '../../concerns/events/.server/event';
import { appMeta } from '~/utils';
import { EventLivePage } from '~/concerns/events/event-live-page';

export function meta({ loaderData }: Route.MetaArgs) {
  return appMeta(
    `${loaderData?.event?.name || 'リレー'}の配信中`,
    'リレーの現在の配信状況をライブで確認できます',
  );
}

export async function loader({ context, params, request }: Route.LoaderArgs) {
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

  // リクエストからparentドメインを取得
  const url = new URL(request.url);
  const parentDomain = url.hostname;

  return { event, currentSubmission, parentDomain };
}

export default function EventLive({ loaderData }: Route.ComponentProps) {
  const { event, currentSubmission, parentDomain } = loaderData || {};

  return (
    <EventLivePage
      event={event}
      currentSubmission={currentSubmission}
      parentDomain={parentDomain}
    />
  );
}
