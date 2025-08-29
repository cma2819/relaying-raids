import { redirect } from 'react-router';
import { ContentContainer } from '~/concerns/common/content-container';
import type { Route } from './+types/index';
import { authenticatedUser } from '../../concerns/auth/.server/auth';
import { getRelayEventsByModerator } from '../../concerns/events/.server/event';
import { EventList } from '~/concerns/events/event-list';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('つくったリレーを確認する', '自分が作成したレイドリレーの一覧です');
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const events = await getRelayEventsByModerator(context, user.id);

  return { user, events };
}

export default function EventsIndex({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData || { events: [] };

  return (
    <ContentContainer title="つくったリレー">
      <EventList events={events} />
    </ContentContainer>
  );
};
