import type { Route } from './+types/home';
import { authenticatedUser, makeAuthenticator } from '~/auth/auth.server';
import { redirect } from 'react-router';
import { ProfileCard } from '~/twitch/profile-card';
import { Menu } from '~/menu/menu';

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await authenticatedUser(context, request.headers.get('cookie'));
  if (!user) {
    throw redirect('/login');
  }
  return { user };
}

export async function action({ request, context }: Route.ActionArgs) {
  const authenticator = await makeAuthenticator(context.cloudflare.env);
  await authenticator.authenticate('twitch', request);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <ProfileCard
        avatar={loaderData.user.avatar}
        login={loaderData.user.login}
        displayName={loaderData.user.name}
      />
      <div className='grid grid-cols-1 gap-4'>
        <Menu />
      </div>
    </div>
  );
}
