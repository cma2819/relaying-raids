import { login, makeAuthenticator } from "~/auth/auth.server";
import { redirect } from "react-router";
import type { Route } from "./+types/callback";

export async function loader({ context, request }: Route.LoaderArgs) {
  const authenticator = await makeAuthenticator(context.cloudflare.env);
  const user = await authenticator.authenticate('twitch', request);

  const cookie = await login(context, request.headers.get('cookie'), user);

  return redirect('/', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}