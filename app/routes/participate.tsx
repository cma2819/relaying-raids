import { redirect } from 'react-router';
import { ContentContainer } from '~/concerns/common/content-container';
import type { Route } from './+types/participate';
import { authenticatedUser } from '../concerns/auth/.server/auth';
import { getRelayEventsByTwitchId } from '../concerns/events/.server/event';
import { ParticipatingEventList } from '~/concerns/events/participating-event-list';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('リレーに参加する', '自分が参加しているレイドリレーの一覧です');
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }

  const events = await getRelayEventsByTwitchId(context, user.login);

  return { user, events };
}

export default function Participate({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData || { events: [] };

  return (
    <ContentContainer title="リレーに参加する">
      <ParticipatingEventList events={events} />
    </ContentContainer>
  );
}
