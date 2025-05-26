import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authValidator } from '../validators/authValidator';

const router = Router();

router.post('/register', authValidator.register, AuthController.register);
router.post('/login', authValidator.login, AuthController.login);

export const authRoutes = router;