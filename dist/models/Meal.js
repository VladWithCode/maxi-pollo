"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var MealSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: null },
    thumb: { type: String, required: true },
    available: { type: Boolean, default: true }
});
exports.default = mongoose_1.model('Meal', MealSchema);
