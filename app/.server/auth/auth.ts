import { Authenticator } from 'remix-auth';
import { createCookieSessionStorage } from 'react-router';
import { Twitch } from '../../../shared/services/twitch';
import { TwitchStrategy } from './strategy';
import type { AppLoadContext } from 'react-router';
import type { User } from '../../../shared/types/user';

export const createSessionStorage = (env: Env) => {
  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [env.APPLICATION_SECRET], // replace this with an actual secret
      secure: env.RUNTIME_ENV === 'production',
    },
  });
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return
export const makeAuthenticator = async (env: Env) => {
  const authenticator = new Authenticator<User>();
  const twitchApi = Twitch({ clientId: env.TWITCH_CLIENT_ID });

  authenticator.use(
    await new TwitchStrategy<User>(
      {
        clientId: env.TWITCH_CLIENT_ID,
        clientSecret: env.TWITCH_CLIENT_SECRET,
        authorizationEndpoint: 'https://id.twitch.tv/oauth2/authorize',
        tokenEndpoint: 'https://id.twitch.tv/oauth2/token',
        redirectURI: env.TWITCH_REDIRECT_URI,
        scopes: ['user:read:email', 'channel:manage:raids'],
      },
      async ({ tokens }) => {
        const user = await twitchApi.getMe({ bearer: tokens.accessToken() });
        return {
          id: user.id,
          login: user.login,
          email: user.email,
          name: user.display_name,
          avatar: user.profile_image_url,
          accessToken: tokens.accessToken(),
          refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
        };
      },
    ),
    'twitch',
  );

  return authenticator;
};

export const login = async (ctx: AppLoadContext, cookieString: string | null, user: User): Promise<string> => {
  const sessionStorage = createSessionStorage(ctx.cloudflare.env);
  const session = await sessionStorage.getSession(cookieString);
  session.set('user', user);

  return await sessionStorage.commitSession(session);
};

export const authenticatedUser = async (ctx: AppLoadContext, cookieString: string | null): Promise<User> => {
  const session = await createSessionStorage(ctx.cloudflare.env).getSession(cookieString);
  return session.get('user');
};

export const logout = async (ctx: AppLoadContext, cookieString: string | null): Promise<string> => {
  const sessionStorage = createSessionStorage(ctx.cloudflare.env);
  const session = await sessionStorage.getSession(cookieString);
  return await sessionStorage.destroySession(session);
};
