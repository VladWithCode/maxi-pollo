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
        items: [
            {
                title: String,
                qty: Number,
                price: Number,
                total: Number,
                sauce: String,
            },
        ],
    },
    state: {
        type: String,
        default: 'initialized',
        enum: ['initialized', 'confirmed', 'payed', 'delivered'],
    },
    paymentMethod: { type: String, default: 'Efectivo' },
    createdAt: { type: Number, default: Date.now() },
    confirmedAt: { type: Number },
    payed: { type: Boolean, default: false },
    payedAt: Number,
    delivered: { type: Boolean, default: false },
    subtotal: { type: Number },
    deliveryFee: { type: Number },
    tax: { type: Number },
    total: { type: Number },
});
exports.default = mongoose_1.model('Sale', SaleSchema);
