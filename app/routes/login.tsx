import type { Route } from './+types/home';
import { makeAuthenticator } from '~/auth/auth.server';
import { Form } from 'react-router';

export function meta() {
  return [
    { title: 'Relaying Raids' },
    { name: 'description', content: 'The tool for following Twitch raids.' },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const authenticator = await makeAuthenticator(context.cloudflare.env);
  await authenticator.authenticate('twitch', request);
}

export default function Home() {
  return (
    <Form method='post'>
      <div className="flex justify-center">
        <button className='bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded text-white' type="submit" name="login">Login with Twitch</button>
      </div>
    </Form>
  );
}
