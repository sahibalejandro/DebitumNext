import { applyMiddlewares } from '@/middleware';
import { userOwnsPayment } from '@/middleware/ownership';
import { authenticationRequired } from '@/middleware/auth';

export default applyMiddlewares(
  authenticationRequired,
  userOwnsPayment,
  async () => {
    return (
      <>
        <div data-testid="alert">Payment Name created!</div>
        <h1 data-testid="payment-name">Payment Name</h1>
      </>
    );
  },
);
