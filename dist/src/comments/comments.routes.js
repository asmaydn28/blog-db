import { Router } from 'express';
import CommentController from './comments.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
const commentController = new CommentController();
router.get('/', commentController.findAll);
router.get('/:id', commentController.findOne);
router.post('/', authMiddleware, commentController.create);
router.patch('/:id', authMiddleware, commentController.update);
router.delete('/:id', authMiddleware, commentController.delete);
export default router;
//# sourceMappingURL=comments.routes.js.map