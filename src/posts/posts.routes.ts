import { Router } from 'express';
import PostController from './posts.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
const postController = new PostController();

router.post('/', authMiddleware, postController.create);
router.get('/', postController.findAll);
router.get('/:id', postController.findOne);
router.patch('/:id', postController.update);
router.delete('/:id', postController.delete);
router.post('/:id/tags', postController.addTag);
router.delete('/:id/tags', postController.removeTag);

export default router;
