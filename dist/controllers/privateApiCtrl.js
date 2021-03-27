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
var Admin_1 = __importDefault(require("../models/Admin"));
var Meal_1 = __importDefault(require("../models/Meal"));
var Sauce_1 = __importDefault(require("../models/Sauce"));
var PrivateAPIController = (function () {
    function PrivateAPIController() {
    }
    PrivateAPIController.prototype.fetchCurrentState = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result, queries, sauces, meals, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = {
                            saleState: req.app.locals.saleState,
                        };
                        queries = [Sauce_1.default.find(), Meal_1.default.find()];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, Promise.all(queries)];
                    case 2:
                        _a = _b.sent(), sauces = _a[0], meals = _a[1];
                        return [3, 4];
                    case 3:
                        err_1 = _b.sent();
                        next(err_1);
                        return [3, 4];
                    case 4:
                        sauces &&
                            sauces.forEach(function (sauce) {
                                if (!result.sauceState)
                                    return (result.sauceState = [
                                        { name: sauce.name, state: sauce.available },
                                    ]);
                                return result.sauceState.push({
                                    name: sauce.name,
                                    state: sauce.available,
                                });
                            });
                        meals &&
                            meals.forEach(function (meal) {
                                if (!result.mealState)
                                    return (result.mealState = [
                                        { name: meal.name, state: meal.available },
                                    ]);
                                return result.mealState.push({
                                    name: meal.name,
                                    state: meal.available,
                                });
                            });
                        return [2, res.status(200).json({
                                status: 'OK',
                                state: result,
                            })];
                }
            });
        });
    };
    PrivateAPIController.prototype.createMeal = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, price, category, description, thumb, newMeal, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, price = _a.price, category = _a.category, description = _a.description, thumb = _a.thumb;
                        newMeal = new Meal_1.default({
                            name: name,
                            price: price,
                            category: category,
                            description: description,
                            thumb: thumb,
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, newMeal.save()];
                    case 2:
                        _b.sent();
                        return [3, 4];
                    case 3:
                        err_2 = _b.sent();
                        return [2, next(err_2)];
                    case 4:
                        res.json({
                            status: 'CREATED',
                            message: 'Producto creado exitosamente',
                            id: newMeal.id,
                        });
                        return [2];
                }
            });
        });
    };
    PrivateAPIController.prototype.updateMeal = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, name, price, category, description, thumb, foundMeal, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _a = req.body, name = _a.name, price = _a.price, category = _a.category, description = _a.description, thumb = _a.thumb;
                        return [4, Meal_1.default.findById(id)];
                    case 1:
                        foundMeal = _b.sent();
                        if (!foundMeal) {
                            res.json({
                                status: 'NOT_FOUND',
                                message: "No se encontro producto con id: " + id,
                            });
                            return [2];
                        }
                        foundMeal === null || foundMeal === void 0 ? void 0 : foundMeal.set({
                            name: name || foundMeal.name,
                            price: price || foundMeal.price,
                            category: category || foundMeal.category,
                            description: description || foundMeal.description,
                            thumb: thumb || foundMeal.thumb,
                        });
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4, foundMeal.save()];
                    case 3:
                        _b.sent();
                        return [3, 5];
                    case 4:
                        err_3 = _b.sent();
                        return [2, next(err_3)];
                    case 5: return [2, res.json({
                            status: 'UPDATED',
                            newProduct: foundMeal.toJSON(),
                            id: id,
                        })];
                }
            });
        });
    };
    PrivateAPIController.prototype.updateMealAvailability = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, foundMeal, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4, Meal_1.default.findById(id)];
                    case 1:
                        foundMeal = _a.sent();
                        if (!foundMeal) {
                            return [2, res.json({
                                    status: 'NOT_FOUND',
                                    message: "No se encontro producto con id: " + id,
                                })];
                        }
                        foundMeal.available = !foundMeal.available;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4, (foundMeal === null || foundMeal === void 0 ? void 0 : foundMeal.save())];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_4 = _a.sent();
                        return [2, next(err_4)];
                    case 5: return [2, res.json({
                            status: 'UPDATED',
                            availability: foundMeal === null || foundMeal === void 0 ? void 0 : foundMeal.available,
                            id: id,
                        })];
                }
            });
        });
    };
    PrivateAPIController.prototype.deleteMeal = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, deletedMeal, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, Meal_1.default.findByIdAndDelete(id).lean()];
                    case 2:
                        deletedMeal = _a.sent();
                        return [3, 4];
                    case 3:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [2, res.json({
                                status: 'DB_ERROR',
                                message: "Ocurrio un error con la base de datos.",
                            })];
                    case 4:
                        if (!deletedMeal)
                            return [2, res.json({
                                    status: 'NOT_FOUND',
                                    message: "No se encontro producto con id: " + id,
                                })];
                        return [2, res.json({
                                status: 'OK',
                                message: "Producto con id \"" + id + "\" ha sido eliminado con exito",
                                meal: deletedMeal,
                            })];
                }
            });
        });
    };
    PrivateAPIController.prototype.createSauce = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var name, newSauce, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = req.body.name;
                        newSauce = new Sauce_1.default({
                            name: name,
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, newSauce.save()];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        err_6 = _a.sent();
                        return [2, next(err_6)];
                    case 4: return [2, res.json({
                            status: 'CREATED',
                            message: 'Salsa creada exitosamente',
                            id: newSauce._id,
                        })];
                }
            });
        });
    };
    PrivateAPIController.prototype.updateSauce = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, name, foundSauce, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        name = req.body.name;
                        return [4, Sauce_1.default.findById(id)];
                    case 1:
                        foundSauce = _a.sent();
                        if (!foundSauce) {
                            return [2, res.json({
                                    status: 'NOT_FOUND',
                                    message: "No se encontro salsa con id: " + id,
                                })];
                        }
                        foundSauce.name = name;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4, foundSauce.save()];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_7 = _a.sent();
                        return [2, next(err_7)];
                    case 5: return [2, res.json({
                            status: 'UPDATED',
                            newSauce: foundSauce === null || foundSauce === void 0 ? void 0 : foundSauce.toJSON(),
                            id: id,
                        })];
                }
            });
        });
    };
    PrivateAPIController.prototype.updateSauceAvailability = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, foundSauce, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4, Sauce_1.default.findById(id)];
                    case 1:
                        foundSauce = _a.sent();
                        if (!foundSauce) {
                            res.json({
                                status: 'NOT_FOUND',
                                message: "No se encontro salsa con id: " + id,
                            });
                            return [2];
                        }
                        foundSauce.available = !(foundSauce === null || foundSauce === void 0 ? void 0 : foundSauce.available);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4, (foundSauce === null || foundSauce === void 0 ? void 0 : foundSauce.save())];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_8 = _a.sent();
                        return [2, next(err_8)];
                    case 5: return [2, res.json({
                            status: 'UPDATED',
                            availability: foundSauce === null || foundSauce === void 0 ? void 0 : foundSauce.available,
                            id: id,
                        })];
                }
            });
        });
    };
    PrivateAPIController.prototype.deleteSauce = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, deletedSauce, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, Sauce_1.default.findByIdAndDelete(id).lean()];
                    case 2:
                        deletedSauce = _a.sent();
                        return [3, 4];
                    case 3:
                        err_9 = _a.sent();
                        console.log(err_9);
                        return [2, res.json({
                                status: 'DB_ERROR',
                                message: "Ha ocurrido un error al intentar eliminar la salsa con id: \"" + id + "\"",
                                err: err_9
                            })];
                    case 4:
                        if (!deletedSauce)
                            return [2, res.json({
                                    status: 'NOT_FOUND',
                                    message: "No se ha encontrado salsa con id \"" + id + "\"",
                                })];
                        return [2, res.json({
                                status: 'OK',
                                message: "La salsa con id \"" + id + "\" ha sido eliminada exitosamente",
                                sauce: deletedSauce
                            })];
                }
            });
        });
    };
    PrivateAPIController.prototype.registerAdmin = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, pass, confirmPass, newAdmin, err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('register');
                        _a = req.body, user = _a.user, pass = _a.pass, confirmPass = _a.confirmPass;
                        if (pass !== confirmPass)
                            return [2, res.status(400).json({
                                    status: 'PASS_ERROR',
                                    message: "Las contrase\u00F1as no coinciden",
                                })];
                        return [4, Admin_1.default.exists({ name: user.trim().toLowerCase() })];
                    case 1:
                        if (_b.sent())
                            return [2, res.json({
                                    status: 'USER_ERROR',
                                    message: "El nombre de usuario ya esta registrado",
                                })];
                        newAdmin = new Admin_1.default({
                            name: user,
                            pass: pass,
                        });
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4, newAdmin.save()];
                    case 3:
                        _b.sent();
                        return [3, 5];
                    case 4:
                        err_10 = _b.sent();
                        next(err_10);
                        return [3, 5];
                    case 5: return [2, res.json({
                            status: 'CREATED',
                            message: "Usuario " + user + " fue registrado con exito",
                        })];
                }
            });
        });
    };
    return PrivateAPIController;
}());
exports.default = new PrivateAPIController();
