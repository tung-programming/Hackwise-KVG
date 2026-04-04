// Onboarding routes
import { Router } from 'express';
import { onboardingController } from './onboarding.controller';
import { authGuard } from '../../middleware/auth.guard';
import { validateRequest } from '../auth/auth.middleware';
import { submitStepSchema } from './onboarding.schema';

const router = Router();

router.use(authGuard);

router.get('/status', onboardingController.getStatus);
router.post('/step', validateRequest(submitStepSchema), onboardingController.submitStep);
router.post('/complete', onboardingController.complete);
router.post('/skip', onboardingController.skip);

export default router;
