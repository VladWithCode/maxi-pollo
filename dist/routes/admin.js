"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var adminCtrl_1 = __importDefault(require("../controllers/adminCtrl"));
var router = express_1.Router();
router.route('/login')
    .get(adminCtrl_1.default.renderLogAdminIn)
    .post(adminCtrl_1.default.logAdminIn);
router.get('/', adminCtrl_1.default.index);
router.get('/logout', adminCtrl_1.default.logAdminOut);
exports.default = router;
