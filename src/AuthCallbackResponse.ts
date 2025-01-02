import { NextResponse } from 'next/server';
import { deleteCSRFTokenCookieFromResponse } from './utils/auth';

export default class AuthCallbackResponse extends NextResponse {
  constructor(...args: ConstructorParameters<typeof NextResponse>) {
    super(...args);

    deleteCSRFTokenCookieFromResponse(this);
  }
}
