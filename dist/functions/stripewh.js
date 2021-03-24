"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stripe_1 = __importDefault(require("../config/stripe"));
function stripeWhHandler(req, res, next) {
    var evt;
    try {
        evt = stripe_1.default.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET ||
            'whsec_lUsZp2jqeVpbKSByB9VJmBSxWrZPzW6q');
    }
    catch (err) {
        console.log(err);
        console.log("\u26A0\uFE0F  Webhook signature verification failed.");
        console.log("\u26A0\uFE0F  Check the env file and enter the correct webhook secret.");
        return res.sendStatus(400);
    }
    var dataObject = evt.data.object;
    switch (evt.type) {
        case 'invoice.paid':
            console.log('Invoice paid!');
            console.log(dataObject);
            break;
        case 'invoice.payment_failed':
            console.log(dataObject);
            break;
        case 'customer.subscription.deleted':
            if (evt.request != null) {
            }
            else {
            }
            break;
        case 'customer.created':
            console.log('Created a new Customer!');
        default:
    }
    res.status(200).send();
}
exports.default = stripeWhHandler;
