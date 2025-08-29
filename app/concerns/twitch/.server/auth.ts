import type { AppLoadContext } from 'react-router';
import { Twitch, TwitchTokenExpiredError } from '../../../../shared/services/twitch';
import { refresh, authenticatedUser } from '../../auth/.server/auth';
import type { User } from '../../../../shared/types/user';

export type TokenValidationResult = {
  user: User;
  updatedCookie?: string;
};

export const validateAndRefreshToken = async (
  context: AppLoadContext,
  user: User,
  cookieString: string | null,
): Promise<TokenValidationResult> => {
  const twitchApi = Twitch({ clientId: context.cloudflare.env.TWITCH_CLIENT_ID });

  // トークンの生存確認のため、軽量なAPI呼び出しを実行
  const userResult = await twitchApi.getMe({ bearer: user.accessToken });

  if (userResult.isOk()) {
    // トークンが有効
    return { user };
  }

  // エラーが401（トークン期限切れ）の場合のみリフレッシュを試行
  if (userResult.error instanceof TwitchTokenExpiredError) {
    // トークンをリフレッシュ
    const updatedCookie = await refresh(context, cookieString, user);

    // リフレッシュされたセッションから新しいユーザー情報を取得
    const refreshedUser = await authenticatedUser(context, updatedCookie);
    if (!refreshedUser) {
      throw new Error('Failed to get refreshed user from session');
    }

    return { user: refreshedUser, updatedCookie };
  }

  // 401以外のエラーの場合はそのまま投げる
  throw userResult.error;
};
