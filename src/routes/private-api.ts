import { NextFunction, Request, Response, Router } from 'express';
import privateApiCtrl from '../controllers/privateApiCtrl';

const router = Router();

router.post('/meals', privateApiCtrl.createMeal);

router.put('/meals/:id', privateApiCtrl.updateMeal);

router.patch('/meals/:id', privateApiCtrl.updateMealAvailability);

router.delete('/sauces/:id', privateApiCtrl.deleteMeal);

router.post('/sauces', privateApiCtrl.createSauce);

router.put('/sauces/:id', privateApiCtrl.updateSauce);

router.patch('/sauces/:id', privateApiCtrl.updateSauceAvailability);

router.delete('/sauces/:id', privateApiCtrl.deleteSauce);

router.route('/admin').post(privateApiCtrl.registerAdmin);

router.patch('/admin/pass-update', privateApiCtrl.changePass);

router.route('/state').get(privateApiCtrl.fetchCurrentState);

router.use(
  (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) return next();
    console.log('Private API ERROR\n', err);

    if (err.name === 'MongoError') {
      res.status(500).json({
        status: 'DB_ERROR',
        message: 'Ocurrio un error con la base de datos',
        err,
      });
      return;
    }

    res.status(500).json({
      status: 'SERVER_ERROR',
      message: 'Ocurrio un error interno en el servidor',
      err,
    });
    return;
  }
);

export default router;
