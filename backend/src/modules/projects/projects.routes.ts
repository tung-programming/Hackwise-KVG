// Projects routes
import { Router } from 'express';
import { projectsController } from './projects.controller';
import { authGuard } from '../../middleware/auth.guard';
import { validateRequest } from '../auth/auth.middleware';
import { createProjectSchema, updateProjectSchema } from './projects.schema';

const router = Router();

router.use(authGuard);

router.get('/', projectsController.getProjects);
router.get('/:projectId', projectsController.getProject);
router.post('/', validateRequest(createProjectSchema), projectsController.createProject);
router.patch('/:projectId', validateRequest(updateProjectSchema), projectsController.updateProject);
router.post('/:projectId/validate', projectsController.validateProject);
router.delete('/:projectId', projectsController.deleteProject);

export default router;
