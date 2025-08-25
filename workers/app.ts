import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { createRequestHandler, type SessionStorage } from 'react-router';
import { Authenticator } from 'remix-auth';
import * as schema from '../database/schema';
import { makeAuthenticator, createSessionStorage } from '../server/auth/auth';
import { Twitch } from '../server/services/twitch';
import type { User } from '../shared/types/user';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    };
    db: DrizzleD1Database<typeof schema>;
    authenticator: Authenticator<User>;
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
    const authenticator = await makeAuthenticator(env);
    const sessionStorage = createSessionStorage(env);
    const twitchApi = Twitch({ clientId: env.TWITCH_CLIENT_ID });
    return requestHandler(request, {
      cloudflare: { env, ctx },
      db,
      authenticator,
      sessionStorage,
      twitchApi,
    });
  },
} satisfies ExportedHandler<Env>;
