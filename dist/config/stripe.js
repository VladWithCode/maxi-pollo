"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stripe_1 = __importDefault(require("stripe"));
var Stripe = new stripe_1.default(process.env.STRIPE_SK ||
    'sk_test_51IGxuIBpiWpF8qxwcZCPwxx7tD3sxJDO306OvpbeTrupKLInpj589i05U48O1Z0HJWiSPB7QQOBSO3M2UPQUpwam009xEeO1Hy');
exports.default = Stripe;
