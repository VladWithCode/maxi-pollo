import { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Admin from '../models/Admin';

passport.deserializeUser(async (id, done) => {
  try {
    done(null, await Admin.findById(id));
  } catch (err) {
    done(err, false);
  }
});

passport.serializeUser<any, any>((_req, admin, done) => {
  done(null, admin);
});

passport.use(
  'admin.signin',
  new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass',
      passReqToCallback: true,
    },
    async (req: Request, user: string, pass: string, done) => {
      try {
        const admin = await Admin.findOne({ name: user.toLowerCase() });

        if (!admin)
          return done(undefined, false, {
            message: `El usuario ${user} no existe`,
          });

        /* const isPassValid = await admin.validatePass(pass);

        if (!isPassValid) return done(undefined, false, { message: `Contrasena incorrecta`}); */

        return done(undefined, admin);
      } catch (err) {
        done(err, false, { message: `Error al iniciar sesion` });
      }
    }
  )
);
