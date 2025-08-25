import ky from "ky";

type TwitchRequestOption = {
  bearer: string;
  query?: Record<string, string>;
  body?: BodyInit;
}

type TwitchResponse<T> = {
    data: T[],
}

type TwitchUser = {
    id: string;
    login: string;
    display_name: string;
    email: string;
    profile_image_url: string;
};

const TWITCH_API_URL = 'https://api.twitch.tv/helix';

export const Twitch = ({ clientId }: { clientId: string }) => {
  const request = async <T>(method: 'GET' | 'POST', path: string, option: TwitchRequestOption): Promise<TwitchResponse<T>> => {
    const headers = {
      'Authorization': `Bearer ${option.bearer}`,
      'Client-Id': clientId,
      'Content-Type': 'application/json',
    };

    const result = await ky(path, {
      headers,
      method,
      body: option.body,
      searchParams: option.query,
      prefixUrl: TWITCH_API_URL,
    }).json<TwitchResponse<T>>();

    return result;
  };

  return {
    getMe: async ({ bearer }: { bearer: string }): Promise<TwitchUser> => {
      const response = await request<TwitchUser>('GET', 'users', { bearer });
      return response.data[0];
    },
  };
};
