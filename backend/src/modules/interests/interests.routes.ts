// Interests routes
import { Router } from 'express';
import { interestsController } from './interests.controller';
import { authGuard } from '../../middleware/auth.guard';
import { validateRequest } from '../auth/auth.middleware';
import { addInterestSchema } from './interests.schema';

const router = Router();

router.get('/categories', interestsController.getAllCategories);

router.use(authGuard);

router.get('/', interestsController.getInterests);
router.post('/', validateRequest(addInterestSchema), interestsController.addInterest);
router.delete('/:interestId', interestsController.removeInterest);
router.get('/recommendations', interestsController.getRecommendations);

export default router;
