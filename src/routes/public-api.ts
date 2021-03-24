import { NextFunction, Request, Response, Router } from 'express';
import publicApi from '../controllers/publicApiCtrl';

const router = Router();

router.get('/meals', publicApi.fetchMeals);

router.get('/sauces', publicApi.fetchSauces);

router.post('/sale', publicApi.initSale);

router.put('/sale/confirm', publicApi.confirmSale);

router.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) return next();

  console.log('Public API ERROR\n', err);
  res.json({
    status: 'SERVER_ERROR',
    message: `Ocurrio un error interno en el servidor`,
    err
  });
});

export default router;
