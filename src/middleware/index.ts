import { Middleware } from '@/types';
import { RequestContext } from '@/RequestContext';

export function applyMiddlewares<P, R>(...middlewares: Middleware<P, R>[]) {
  return async function (requestOrProps: P) {
    const requestContext = new RequestContext();

    for (const middleware of middlewares) {
      let response = await middleware(requestOrProps, requestContext);

      if (response) {
        return response;
      }
    }
  };
}
