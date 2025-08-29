import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { createRequestHandler, type SessionStorage } from 'react-router';
import { Authenticator } from 'remix-auth';
import * as schema from '../database/schema';
import { makeAuthenticator, createSessionStorage } from '../app/concerns/auth/.server/auth';
import { Twitch } from '../shared/services/twitch';
import type { User } from '../shared/types/user';
import type { TwitchStrategy } from '~/concerns/auth/.server/strategy';

declare module 'react-router' {
  export interface AppLoadContext {
    auth: {
      authenticator: Authenticator<User>;
      strategy: TwitchStrategy<User>;
    };
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
    sessionStorage: SessionStorage;
    twitchApi: ReturnType<typeof Twitch>;
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const db = drizzle(env.DB, { schema });
    const { authenticator, strategy } = await makeAuthenticator(env);
    const sessionStorage = createSessionStorage(env);
    const twitchApi = Twitch({ clientId: env.TWITCH_CLIENT_ID });
    return requestHandler(request, {
      auth: {
        authenticator,
        strategy,
      },
      cloudflare: { env, ctx },
      db,
      sessionStorage,
      twitchApi,
    });
  },
} satisfies ExportedHandler<Env>;
