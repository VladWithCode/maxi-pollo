// Module imports
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import hbs from 'express-handlebars';
import path from 'path';
import flash from 'connect-flash';
import sessionStorage from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';

// Inits
const app = express();
const mdbStore = new (sessionStorage(session))(
  {
    collection: 'sessions',
    uri: process.env.DB_URI || 'mongodb://localhost/meals',
    expires: 1000 * 60 * 60 * 24 * 7, // 1 Week
  },
  (err) => {
    if (!err) return;

    throw err;
  }
);
import './config/db';
import './config/passport';

/* Route Imports */
import publicRoutes from './routes/public-api';
import privateRoutes from './routes/private-api';
import adminRoutes from './routes/admin';

/* Helpers & Middlewares */
import stripeWh from './functions/stripewh';
import { isAuthenticated } from './functions/helpers';
import { IAdmin } from './models/Admin';

// Settings
app.set('public', path.join(process.cwd(), 'public'));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(process.cwd(), 'views'));
app.engine(
  '.hbs',
  hbs({
    extname: '.hbs',
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: undefined,
    helpers: {},
  })
);
app.set('view engine', '.hbs');
app.locals.saleState = true; // Set sale state to true when server starts

// Stripe Webhooks raw body parsing
app.use('/stripe/wh', express.raw({ type: 'application/json' }), stripeWh);

// Middlewares
app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'keyboardcat'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'supersecretsecret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 Week
      sameSite: true,
    },
    store: mdbStore,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Use morgan loggin when not in production mode
process.env.NODE_ENV !== 'production' && app.use(morgan('dev'));

// Globals
app.use((req: Request, res: Response, next: NextFunction) => {
  let user = req.user as IAdmin;
  res.locals.error_message = req.flash('error_message')[0];
  res.locals.user = user?.name;

  return next();
});

// Routes
app.use('/api', publicRoutes); // Public API
app.use('/api', isAuthenticated, privateRoutes); // Private API
app.use('/admin', adminRoutes); // Admin Dashboard

// Static Files
app.use(express.static(app.get('public')));

// Startup
app.listen(app.get('port'), () =>
  console.log(`Server listening on port: ${app.get('port')}`)
);
