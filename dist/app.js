"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var path_1 = __importDefault(require("path"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
var mdbStore = new (connect_mongodb_session_1.default(express_session_1.default))({
    collection: 'sessions',
    uri: process.env.DB_URI || 'mongodb://localhost/meals',
    expires: 1000 * 60 * 60 * 24 * 7,
}, function (err) {
    if (!err)
        return;
    throw err;
});
require("./config/db");
require("./config/passport");
var public_api_1 = __importDefault(require("./routes/public-api"));
var private_api_1 = __importDefault(require("./routes/private-api"));
var admin_1 = __importDefault(require("./routes/admin"));
var stripewh_1 = __importDefault(require("./functions/stripewh"));
app.set('public', path_1.default.join(__dirname, '..', 'public'));
app.set('port', process.env.PORT || 3000);
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.engine('.hbs', express_handlebars_1.default({
    extname: '.hbs',
    partialsDir: path_1.default.join(app.get('views'), 'partials'),
    defaultLayout: undefined,
    helpers: {},
}));
app.set('view engine', '.hbs');
app.locals.saleState = true;
app.use('/stripe/wh', express_1.default.raw({ type: 'application/json' }), stripewh_1.default);
app.use(cors_1.default());
app.use(express_1.default.json({}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default(process.env.COOKIE_SECRET || 'keyboardcat'));
app.use(express_session_1.default({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'supersecretsecret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: true,
    },
    store: mdbStore,
}));
app.use(connect_flash_1.default());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
process.env.NODE_ENV !== 'production' && app.use(morgan_1.default('dev'));
app.use(function (req, res, next) {
    var user = req.user;
    res.locals.error_message = req.flash('error_message')[0];
    res.locals.user = user === null || user === void 0 ? void 0 : user.name;
    return next();
});
app.use('/api', public_api_1.default);
app.use('/api', private_api_1.default);
app.use('/admin', admin_1.default);
app.use(express_1.default.static(app.get('public')));
app.listen(app.get('port'), function () {
    return console.log("Server listening on port: " + app.get('port'));
});
