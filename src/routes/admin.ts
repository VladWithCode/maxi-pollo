import { Router } from 'express';
import adminCtrl from '../controllers/adminCtrl';
import { isAuthenticated } from '../functions/helpers';

const router = Router();

// Admin login route
router
  .route('/login')
  .get(adminCtrl.renderLogAdminIn)
  .post(adminCtrl.logAdminIn);

router.use(isAuthenticated);

router.get('/', adminCtrl.index);

router.get('/user/change-password', adminCtrl.renderChangePass);

router.get('/logout', adminCtrl.logAdminOut);

export default router;
