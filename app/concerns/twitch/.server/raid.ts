import type { AppLoadContext } from 'react-router';
import { Twitch } from '../../../../shared/services/twitch';
import type { User } from '../../../../shared/types/user';

export const executeRaid = async (
  context: AppLoadContext,
  user: User,
  fromBroadcasterId: string,
  toBroadcasterLogin: string,
) => {
  const twitchApi = Twitch({ clientId: context.cloudflare.env.TWITCH_CLIENT_ID });

  // 対象チャンネルの情報を取得してIDを取得
  const targetChannelResult = await twitchApi.getChannelInfo({
    bearer: user.accessToken,
    login: toBroadcasterLogin,
  });

  if (targetChannelResult.isErr()) {
    throw targetChannelResult.error;
  }

  const targetChannel = targetChannelResult.value;

  // Raidを実行
  const raidResult = await twitchApi.startRaid({
    bearer: user.accessToken,
    fromBroadcasterId: fromBroadcasterId,
    toBroadcasterId: targetChannel.id,
  });

  if (raidResult.isErr()) {
    throw raidResult.error;
  }

  return {
    success: true,
  };
};
