import type { Route } from './+types/home';
import { redirect } from 'react-router';
import { ProfileCard } from '~/concerns/twitch/profile-card';
import { Menu } from '~/concerns/menu/menu';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('ホーム', 'Twitchリレー企画の管理・参加ができるホーム画面です');
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await context.sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user) {
    throw redirect('/login');
  }
  return { user };
}

export async function action({ request, context }: Route.ActionArgs) {
  await context.auth.authenticator.authenticate('twitch', request);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProfileCard
        avatar={loaderData.user.avatar}
        login={loaderData.user.login}
        displayName={loaderData.user.name}
      />
      <div className="grid grid-cols-1 gap-4">
        <Menu />
      </div>
    </div>
  );
}
