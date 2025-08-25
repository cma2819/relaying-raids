import { logout } from "~/auth/auth.server";
import { redirect } from "react-router";
import type { Route } from "./+types/callback";

export async function loader({ context, request }: Route.LoaderArgs) {
  const cookie = await logout(context, request.headers.get('cookie'));

  return redirect('/login', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}