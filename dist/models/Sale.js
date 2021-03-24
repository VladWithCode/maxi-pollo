"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var SaleSchema = new mongoose_1.Schema({
    customer: {
        name: String,
        phone: String,
    },
    address: {
        street: String,
        nbHood: String,
        extNumber: Number,
        intNumber: String,
        postalCode: Number,
        refs: String,
    },
    content: {
        sauce: String,
        items: [
            {
                title: String,
                qty: Number,
                price: Number,
                total: Number,
            },
        ],
    },
    paymentMethod: String,
    createdAt: { type: Number, default: Date.now() },
    payed: Boolean,
    payedAt: Number,
    delivered: Boolean,
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
});
exports.default = mongoose_1.model('Sale', SaleSchema);
