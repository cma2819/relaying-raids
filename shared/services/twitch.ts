import ky, { HTTPError } from 'ky';
import { Result, ok, err } from 'neverthrow';

export class TwitchTokenExpiredError extends Error {
  constructor(message = 'Twitch access token has expired') {
    super(message);
    this.name = 'TwitchTokenExpiredError';
  }
}

export type TwitchError = TwitchTokenExpiredError | Error;

type TwitchRequestOption = {
  bearer: string;
  query?: Record<string, string>;
  body?: BodyInit;
};

type TwitchResponse<T> = {
  data: T[];
};

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  email: string;
  profile_image_url: string;
};

const TWITCH_API_URL = 'https://api.twitch.tv/helix';

export const Twitch = ({ clientId }: { clientId: string }) => {
  const request = async <T>(method: 'GET' | 'POST', path: string, option: TwitchRequestOption): Promise<Result<TwitchResponse<T>, TwitchError>> => {
    const headers = {
      'Authorization': `Bearer ${option.bearer}`,
      'Client-Id': clientId,
      'Content-Type': 'application/json',
    };

    try {
      const result = await ky(path, {
        headers,
        method,
        body: option.body,
        searchParams: option.query,
        prefixUrl: TWITCH_API_URL,
      }).json<TwitchResponse<T>>();

      return ok(result);
    }
    catch (error) {
      if (error instanceof HTTPError && error.response.status === 401) {
        return err(new TwitchTokenExpiredError());
      }
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return {
    getMe: async ({ bearer }: { bearer: string }): Promise<Result<TwitchUser, TwitchError>> => {
      const response = await request<TwitchUser>('GET', 'users', { bearer });
      return response.map(res => res.data[0]);
    },
    getChannelInfo: async ({ bearer, login }: { bearer: string; login: string }): Promise<Result<TwitchUser, TwitchError>> => {
      const response = await request<TwitchUser>('GET', 'users', { bearer, query: { login } });
      return response.map(res => res.data[0]);
    },
    startRaid: async ({ bearer, fromBroadcasterId, toBroadcasterId }: { bearer: string; fromBroadcasterId: string; toBroadcasterId: string }): Promise<Result<void, TwitchError>> => {
      const response = await request('POST', 'raids', {
        bearer,
        query: {
          from_broadcaster_id: fromBroadcasterId,
          to_broadcaster_id: toBroadcasterId,
        },
      });
      return response.map(() => undefined);
    },
  };
};
