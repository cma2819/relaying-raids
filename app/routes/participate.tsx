import { redirect } from 'react-router';
import { ContentContainer } from '~/common/content-container';
import type { Route } from './+types/participate';
import { authenticatedUser } from '../.server/auth/auth';
import { getRelayEventsByTwitchId } from '../.server/services/event';
import { ParticipatingEventList } from '~/events/participating-event-list';
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
