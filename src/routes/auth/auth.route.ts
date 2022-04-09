import express from 'express';
import { AuthController } from '../../controllers';

const router = express.Router();

router.post('/api/auth/register', AuthController.register);
router.post('/api/auth/login', AuthController.login);
router.get('/api/auth/refresh', AuthController.refresh);

export default router;
