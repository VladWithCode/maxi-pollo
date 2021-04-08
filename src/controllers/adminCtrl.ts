import passport from 'passport';
import { IAdmin } from '../models/Admin';
import { Request, Response, NextFunction } from 'express';

class AdminController {
  public index(req: Request, res: Response, next: NextFunction): void {
    res.render('pages/admin', {});
  }

  public renderLogAdminIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response {
    return res.render('pages/login', {});
  }

  public async logAdminIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    passport.authenticate(
      'admin.signin',
      {
        failureRedirect: '/login',
        successRedirect: '/admin',
        failureFlash: true,
      },
      async (err, user: IAdmin, info) => {
        if (err) return next(err);

        if (!user) return res.redirect('/login');

        if (!(await user.validatePass(req.body.pass))) {
          req.flash('message', 'Contraseña incorrecta');
          return res.redirect('/login');
        }

        req.logIn(user, (err) => {
          if (err) return next(err);

          return res.redirect('/admin');
        });
      }
    )(req, res, next);
  }

  public renderChangePass(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    return res.render('pages/change_pass', {});
  }

  public logAdminOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response {
    req.logout();
    return res.redirect('/admin/login');
  }
}

export default new AdminController();
