import type { NextRequest } from 'next/server';
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

export type Middleware = (
  nextContext: NextContext,
  requestContext: RequestContext,
  propsOrNextRequest: PropsOrNextRequest,
) => Promise<unknown>;

export type PropsOrNextRequest =
  | {
      params: { [key: string]: string | undefined };
      searchParams: { [key: string]: string | string[] | undefined };
    }
  | NextRequest;

export type NextContext =
  | {
      params: { [key: string]: string | undefined };
    }
  | undefined;
