import { google } from 'googleapis';

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '986857537702-conma70oa5t7rqctnjm13g12d93q168s.apps.googleusercontent.com';
const CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || 'hR7epi1cWjFPTD1YtjCLBHLS';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
  process.env.GOOGLE_REFRESH_TOKEN ||
  '1//04r9TRFlGhf6UCgYIARAAGAQSNwF-L9IrFIWAlXNfId5_ceRiNLZ8bFaeVI5g4MbnAnt_xrFRheHpIEe_K-DFAXgHQwr2_QZo_Y0';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default oAuth2Client;

export {
  oAuth2Client,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN
}
