// Resume routes
import { Router } from 'express';
import { resumeController } from './resume.controller';
import { authGuard } from '../../middleware/auth.guard';
import { fileUpload } from '../../middleware/file-upload';
import { validateRequest } from '../auth/auth.middleware';
import { analyzeResumeSchema } from './resume.schema';

const router = Router();

router.use(authGuard);

router.post('/upload', fileUpload.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getResume);
router.post('/analyze', validateRequest(analyzeResumeSchema), resumeController.analyzeResume);
router.post('/ats-score', validateRequest(analyzeResumeSchema), resumeController.getATSScore);
router.delete('/', resumeController.deleteResume);

export default router;
