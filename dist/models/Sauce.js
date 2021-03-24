"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var SauceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    available: { type: Boolean, default: true },
});
exports.default = mongoose_1.model('Sauce', SauceSchema);
