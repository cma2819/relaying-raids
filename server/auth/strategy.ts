import { Twitch } from "arctic";
import { OAuth2Strategy } from "remix-auth-oauth2";
import { Strategy } from "remix-auth/strategy";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TwitchStrategy {
    export interface ConstructorOptions extends OAuth2Strategy.ConstructorOptions {
        clientSecret: string;
        redirectURI: string;
    }

    export type VerifyOptions = OAuth2Strategy.VerifyOptions
}

export class TwitchStrategy<User> extends OAuth2Strategy<User> {
  name = 'twitch-strategy';

  protected twitch: Twitch;

  constructor(
    options: TwitchStrategy.ConstructorOptions,
    verify: Strategy.VerifyFunction<User, TwitchStrategy.VerifyOptions>,
  ) {
    super(options, verify);

    this.twitch = new Twitch(
      options.clientId,
      options.clientSecret,
      options.redirectURI
    );
  }

  override validateAuthorizationCode(code: string) {
    return this.twitch.validateAuthorizationCode(code);
  }
}