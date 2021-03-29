"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var publicApiCtrl_1 = __importDefault(require("../controllers/publicApiCtrl"));
var router = express_1.Router();
router.get('/meals', publicApiCtrl_1.default.fetchMeals);
router.get('/sauces', publicApiCtrl_1.default.fetchSauces);
router.get('/sale/state', publicApiCtrl_1.default.getSaleState);
router.post('/sale', publicApiCtrl_1.default.initSale);
router.put('/sale/confirm', publicApiCtrl_1.default.confirmSale);
router.use(function (err, req, res, next) {
    if (res.headersSent)
        return next();
    console.log('Public API ERROR\n', err);
    res.json({
        status: 'SERVER_ERROR',
        message: "Ocurrio un error interno en el servidor",
        err: err
    });
});
exports.default = router;
