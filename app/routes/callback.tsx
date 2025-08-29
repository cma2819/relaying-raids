import { redirect } from 'react-router';
import type { Route } from './+types/callback';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('認証処理中', 'Twitchアカウントの認証処理を行っています');
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = await context.auth.authenticator.authenticate('twitch', request);

  const session = await context.sessionStorage.getSession(request.headers.get('cookie'));
  session.set('user', user);
  const cookie = await context.sessionStorage.commitSession(session);

  return redirect('/', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
