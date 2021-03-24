"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var privateApiCtrl_1 = __importDefault(require("../controllers/privateApiCtrl"));
var router = express_1.Router();
router.post('/meals', privateApiCtrl_1.default.createMeal);
router.put('/meals', privateApiCtrl_1.default.updateMeal);
router.patch('/meals', privateApiCtrl_1.default.updateMealAvailability);
router.post('/sauces', privateApiCtrl_1.default.createSauce);
router.put('/sauces', privateApiCtrl_1.default.updateSauce);
router.patch('/sauces', privateApiCtrl_1.default.updateSauceAvailability);
router.route('/admin')
    .post(privateApiCtrl_1.default.registerAdmin);
router.route('/state')
    .get(privateApiCtrl_1.default.fetchCurrentState);
router.use(function (err, req, res, next) {
    if (res.headersSent)
        return next();
    console.log('Private API ERROR\n', err);
    if (err.name === 'MongoError') {
        res.status(500).json({
            status: 'DB_ERROR',
            message: 'Ocurrio un error con la base de datos',
            err: err
        });
        return;
    }
    res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'Ocurrio un error interno en el servidor',
        err: err
    });
    return;
});
exports.default = router;
