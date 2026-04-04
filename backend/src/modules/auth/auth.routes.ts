// Auth routes
import { Router } from 'express';
import passport from 'passport';
import { authController } from './auth.controller';
import { authGuard } from '../../middleware/auth.guard';
import { validateRequest } from './auth.middleware';
import { refreshTokenSchema } from './auth.schema';

const router = Router();

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  authController.githubCallback
);

// Token management
router.post(
  '/refresh',
  validateRequest(refreshTokenSchema),
  authController.refreshToken
);

router.post('/logout', authGuard, authController.logout);

// Current user
router.get('/me', authGuard, authController.me);

export default router;
