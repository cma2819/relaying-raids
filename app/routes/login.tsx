import type { Route } from './+types/login';
import { Form } from 'react-router';
import { appMeta } from '~/utils';

export function meta() {
  return appMeta('ログイン', 'Twitchアカウントでログインしてリレー企画に参加しましょう');
}

export async function action({ request, context }: Route.ActionArgs) {
  await context.auth.authenticator.authenticate('twitch', request);
}

export default function Home() {
  return (
    <Form method="post">
      <div className="flex justify-center">
        <button className="bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded text-white" type="submit" name="login">Login with Twitch</button>
      </div>
    </Form>
  );
}
