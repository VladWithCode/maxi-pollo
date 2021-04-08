"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN = exports.CLIENT_SECRET = exports.CLIENT_ID = exports.oAuth2Client = void 0;
var googleapis_1 = require("googleapis");
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
    '986857537702-conma70oa5t7rqctnjm13g12d93q168s.apps.googleusercontent.com';
exports.CLIENT_ID = CLIENT_ID;
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'hR7epi1cWjFPTD1YtjCLBHLS';
exports.CLIENT_SECRET = CLIENT_SECRET;
var REDIRECT_URI = 'https://developers.google.com/oauthplayground';
var REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN ||
    '1//04r9TRFlGhf6UCgYIARAAGAQSNwF-L9IrFIWAlXNfId5_ceRiNLZ8bFaeVI5g4MbnAnt_xrFRheHpIEe_K-DFAXgHQwr2_QZo_Y0';
exports.REFRESH_TOKEN = REFRESH_TOKEN;
var oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
exports.oAuth2Client = oAuth2Client;
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
exports.default = oAuth2Client;
