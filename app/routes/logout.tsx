import { redirect } from 'react-router';
import type { Route } from './+types/logout';
import { logout } from '../concerns/auth/.server/auth';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('ログアウト', 'ログアウト処理を行います');
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const cookie = await logout(context, request.headers.get('cookie'));

  return redirect('/login', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
