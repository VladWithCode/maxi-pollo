import { NextFunction, Request, Response, Router } from 'express';
import privateApiCtrl from '../controllers/privateApiCtrl';

const router = Router();

router.post('/meals', privateApiCtrl.createMeal);

router.put('/meals', privateApiCtrl.updateMeal);

router.patch('/meals', privateApiCtrl.updateMealAvailability);

router.post('/sauces', privateApiCtrl.createSauce);

router.put('/sauces', privateApiCtrl.updateSauce);

router.patch('/sauces', privateApiCtrl.updateSauceAvailability);

router.route('/admin')
  .post(privateApiCtrl.registerAdmin);

router.route('/state')
  .get(privateApiCtrl.fetchCurrentState);

router.use(
  (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) return next();
    console.log('Private API ERROR\n', err);

    if (err.name === 'MongoError') {
      res.status(500).json({
        status: 'DB_ERROR',
        message: 'Ocurrio un error con la base de datos',
        err
      });
      return;
    }

    res.status(500).json({
      status: 'SERVER_ERROR',
      message: 'Ocurrio un error interno en el servidor',
      err
    });
    return;
  }
);

export default router;
