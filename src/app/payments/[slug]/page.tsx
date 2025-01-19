import { applyMiddlewares } from '@/middleware';
import { authPageMiddleware } from '@/middleware/auth';

export default applyMiddlewares<Record<string, unknown>, JSX.Element | void>(
  authPageMiddleware,
  async () => {
    return (
      <>
        <div data-testid="alert">Payment Name created!</div>
        <h1 data-testid="payment-name">Payment Name</h1>
      </>
    );
  },
);
