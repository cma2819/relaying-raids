import type { AppLoadContext } from 'react-router';
import { Twitch } from '../../../shared/services/twitch';

export const executeRaid = async (
  context: AppLoadContext,
  userAccessToken: string,
  fromBroadcasterId: string,
  toBroadcasterLogin: string,
) => {
  const twitchApi = Twitch({ clientId: context.cloudflare.env.TWITCH_CLIENT_ID });

  // 対象チャンネルの情報を取得してIDを取得
  const targetChannel = await twitchApi.getChannelInfo({
    bearer: userAccessToken,
    login: toBroadcasterLogin,
  });

  // Raidを実行
  await twitchApi.startRaid({
    bearer: userAccessToken,
    fromBroadcasterId: fromBroadcasterId,
    toBroadcasterId: targetChannel.id,
  });

  return { success: true };
};
