import { Router } from 'express';
import CommentController from './comments.controller.js';
const router = Router();
const commentController = new CommentController();
router.post('/', commentController.create);
router.get('/', commentController.findAll);
router.get('/:id', commentController.findOne);
router.patch('/:id', commentController.update);
router.delete('/:id', commentController.delete);
export default router;
//# sourceMappingURL=comments.routes.js.map