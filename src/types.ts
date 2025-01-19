import type { RequestContext } from './RequestContext';

export type OAuth2TokenExchangeResponse = {
  id_token?: string;
};

export type OAuth2UserInfo = {
  name: string;
  email: string;
  picture: string;
};

export type ErrorHandler = (...messages: string[]) => void;

export type Middleware<P, R> = (
  requestOrProps: P,
  requestContext: RequestContext,
) => Promise<R | undefined>;
