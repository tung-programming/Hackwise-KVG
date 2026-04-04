// Courses routes
import { Router } from 'express';
import { coursesController } from './courses.controller';
import { authGuard } from '../../middleware/auth.guard';
import { validateRequest } from '../auth/auth.middleware';
import { generateRoadmapSchema, updateProgressSchema } from './courses.schema';

const router = Router();

router.use(authGuard);

router.get('/', coursesController.getCourses);
router.get('/:courseId', coursesController.getCourse);
router.post('/roadmap', validateRequest(generateRoadmapSchema), coursesController.generateRoadmap);
router.patch('/:courseId/progress', validateRequest(updateProgressSchema), coursesController.updateProgress);
router.delete('/:courseId', coursesController.deleteCourse);

export default router;
