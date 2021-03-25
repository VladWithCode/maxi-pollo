"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var helpers_1 = require("../functions/helpers");
var oauth_1 = require("../config/oauth");
var Meal_1 = __importDefault(require("../models/Meal"));
var Sale_1 = __importDefault(require("../models/Sale"));
var Sauce_1 = __importDefault(require("../models/Sauce"));
var PublicAPIController = (function () {
    function PublicAPIController() {
    }
    PublicAPIController.prototype.fetchMeals = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var category, foundMeals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = req.query.category;
                        if (!(category && category.length > 0)) return [3, 2];
                        return [4, Meal_1.default.find({ category: category }).sort({
                                price: 1,
                            })];
                    case 1:
                        foundMeals = _a.sent();
                        return [3, 4];
                    case 2: return [4, Meal_1.default.find().sort({ price: 1 })];
                    case 3:
                        foundMeals = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (foundMeals && !foundMeals.length) {
                            if (category !== undefined || category !== null) {
                                return [2, res.json({
                                        status: 'NO_CONTENT',
                                        message: "No se han encontrado productos disponibles con categoria: " + category,
                                    })];
                            }
                            return [2, res.json({
                                    status: 'NO_CONTENT',
                                    message: "No se han encontrado productos disponibles.",
                                })];
                        }
                        return [2, res.json({
                                status: 'OK',
                                message: "Se han encontrado " + foundMeals.length + " documentos con categoria \"" + category + "\"",
                                meals: foundMeals === null || foundMeals === void 0 ? void 0 : foundMeals.map(function (meal) { return meal.toJSON(); }),
                            })];
                }
            });
        });
    };
    PublicAPIController.prototype.fetchSauces = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var foundSauces;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Sauce_1.default.find({ available: true }, { name: true, available: true })];
                    case 1:
                        foundSauces = _a.sent();
                        if (foundSauces && !foundSauces.length) {
                            return [2, res.json({
                                    status: 'NOT_FOUND',
                                    message: "No se han encontrado salsas disponibles",
                                })];
                        }
                        return [2, res.json({
                                status: 'OK',
                                message: "Se han encontrado " + foundSauces.length + " salsas disponibles.",
                                sauces: foundSauces.map(function (sauce) { return sauce.toJSON(); }),
                            })];
                }
            });
        });
    };
    PublicAPIController.prototype.initSale = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, contents, customer, payMeth, sauceIds, mealIds, queries, _b, meals, sauces, saleContents, newSale, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, contents = _a.contents, customer = _a.customer, payMeth = _a.payMeth;
                        sauceIds = helpers_1.getSauceIDArray(contents);
                        mealIds = helpers_1.getMealIDArray(contents);
                        queries = [
                            Meal_1.default.find({ _id: mealIds }),
                            Sauce_1.default.find({ _id: sauceIds }),
                        ];
                        return [4, Promise.all(queries)];
                    case 1:
                        _b = _c.sent(), meals = _b[0], sauces = _b[1];
                        saleContents = helpers_1.createSaleContents(contents, meals, sauces);
                        newSale = new Sale_1.default({
                            customer: {
                                name: customer.clientname,
                                phone: customer.phone,
                            },
                            address: {
                                street: customer.street,
                                extNumber: customer.extnumber,
                                nbHood: customer.nbhood,
                                postalCode: customer.postalcode,
                                intNumber: customer.intnumber || null,
                                refs: customer.refs || null,
                            },
                            content: {
                                items: saleContents,
                            },
                            paymentMethod: payMeth || 'Efectivo',
                            subtotal: helpers_1.calculateSalePrice(saleContents),
                        });
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4, newSale.save()];
                    case 3:
                        _c.sent();
                        return [3, 5];
                    case 4:
                        err_1 = _c.sent();
                        console.log(err_1);
                        return [2, res.json({
                                status: 'SAVE_ERROR',
                                message: "Ha ocurrido un error al guardar la compra en la base de datos.\n        " + (err_1.message || ''),
                                err: err_1,
                            })];
                    case 5: return [2, res.json({
                            status: 'OK',
                            message: 'Sale initialized',
                            sale: newSale.toJSON(),
                        })];
                }
            });
        });
    };
    PublicAPIController.prototype.confirmSale = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var saleId, saleQuery, accessTokenQuery, _a, sale, accessToken, err_2, transporter, mailOptions, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        saleId = req.body.id;
                        saleQuery = Sale_1.default.findById(saleId);
                        accessTokenQuery = oauth_1.oAuth2Client.getAccessToken();
                        return [4, Promise.all([
                                saleQuery,
                                accessTokenQuery,
                            ])];
                    case 1:
                        _a = _b.sent(), sale = _a[0], accessToken = _a[1];
                        if (!sale) {
                            return [2, res.json({
                                    status: 'SALE_NOT_FOUND',
                                    message: 'No se pudo encontrar una venta con este id',
                                })];
                        }
                        sale.state = 'confirmed';
                        sale.confirmedAt = Date.now();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4, sale.save()];
                    case 3:
                        _b.sent();
                        return [3, 5];
                    case 4:
                        err_2 = _b.sent();
                        console.log(err_2);
                        return [2, res.json({
                                status: 'SAVE_ERROR',
                                message: err_2.message ||
                                    'Ocurrio un error al intentar actualizar la base de datos',
                                err: err_2,
                            })];
                    case 5:
                        transporter = nodemailer_1.default.createTransport({
                            service: 'gmail',
                            auth: {
                                type: 'OAuth2',
                                user: 'vladwithcode@gmail.com',
                                clientId: oauth_1.CLIENT_ID,
                                clientSecret: oauth_1.CLIENT_SECRET,
                                refreshToken: oauth_1.REFRESH_TOKEN,
                                accessToken: accessToken,
                            },
                        });
                        mailOptions = {
                            from: 'MAXIPollo | <vladwithcode@gmail.com>',
                            to: process.env.CONTACT_MAIL || 'vladwithb@gmail.com',
                            subject: 'Se ha recibido un nuevo pedido',
                            text: helpers_1.createSaleMailText(sale),
                            html: helpers_1.createSaleMailHTML(sale),
                        };
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4, transporter.sendMail(mailOptions)];
                    case 7:
                        _b.sent();
                        return [3, 9];
                    case 8:
                        err_3 = _b.sent();
                        console.log(err_3);
                        return [2, res.json({
                                status: 'MAIL_ERROR',
                                message: 'Se ha completado la venta, pero no ha sido posible enviar el correo electronico.',
                                err: err_3,
                            })];
                    case 9: return [2, res.json({
                            status: 'OK',
                        })];
                }
            });
        });
    };
    return PublicAPIController;
}());
exports.default = new PublicAPIController();
