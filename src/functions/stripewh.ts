import { Request, Response, NextFunction } from 'express';
import Stripe from '../config/stripe';

export default function stripeWhHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let evt;

  try {
    evt = Stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature']!,
      process.env.STRIPE_WEBHOOK_SECRET ||
        'whsec_lUsZp2jqeVpbKSByB9VJmBSxWrZPzW6q'
    );
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
    return res.sendStatus(400);
  }
  // Extract the object from the event.
  const dataObject = evt.data.object;

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (evt.type) {
    case 'invoice.paid':
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      console.log('Invoice paid!');
      console.log(dataObject);
      break;
    case 'invoice.payment_failed':
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      console.log(dataObject);
      break;
    case 'customer.subscription.deleted':
      if (evt.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break;
    case 'customer.created':
      console.log('Created a new Customer!');
    default:
    // Unexpected event type
  }
  res.status(200).send();
}
