"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var DB_URI = process.env.DB_URI || 'mongodb://localhost/meals';
mongoose_1.default.connect(DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, function (err) {
    if (!err)
        return console.log('Connected to DB');
    console.log(err);
});
exports.default = mongoose_1.default;
