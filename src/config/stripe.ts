import stripe from 'stripe';

const Stripe = new stripe(
  process.env.STRIPE_SK ||
    'sk_test_51IGxuIBpiWpF8qxwcZCPwxx7tD3sxJDO306OvpbeTrupKLInpj589i05U48O1Z0HJWiSPB7QQOBSO3M2UPQUpwam009xEeO1Hy',
  { apiVersion: '2020-08-27' }
);

export default Stripe;
