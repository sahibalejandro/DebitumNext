import { RequestContext } from '@/RequestContext';
import { NextContext, Middleware, PropsOrNextRequest } from '@/types';

export function applyMiddlewares(...middlewares: Middleware[]) {
  return async function (
    propsOrRequest: PropsOrNextRequest,
    nextContext: NextContext,
  ) {
    const requestContext = new RequestContext();

    for (const middleware of middlewares) {
      let response = await middleware(
        propsOrRequest,
        nextContext,
        requestContext,
      );

      if (response) {
        return response;
      }
    }
  };
}
