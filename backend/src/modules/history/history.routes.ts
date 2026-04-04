// History routes
import { Router } from 'express';
import { historyController } from './history.controller';
import { authGuard } from '../../middleware/auth.guard';
import { fileUpload } from '../../middleware/file-upload';

const router = Router();

router.use(authGuard);

router.post('/upload', fileUpload.single('file'), historyController.uploadHistory);
router.get('/', historyController.getHistory);
router.get('/analyze', historyController.analyzeHistory);
router.delete('/', historyController.clearHistory);

export default router;
