import { Router } from 'express';
import PostController from './posts.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
const postController = new PostController();
router.get('/', postController.findAll);
router.get('/:id', postController.findOne);
router.post('/', authMiddleware, postController.create);
router.patch('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.delete);
router.post('/:id/tags', authMiddleware, postController.addTag);
router.delete('/:id/tags/:tagId', authMiddleware, postController.removeTag);
export default router;
//# sourceMappingURL=posts.routes.js.map