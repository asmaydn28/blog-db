import { Router } from 'express';
import TagController from './tags.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
const tagController = new TagController();
router.get('/', tagController.findAll);
router.get('/:id', tagController.findOne);
router.post('/', authMiddleware, tagController.create);
router.patch('/:id', authMiddleware, tagController.update);
router.delete('/:id', authMiddleware, tagController.delete);
export default router;
//# sourceMappingURL=tags.routes.js.map