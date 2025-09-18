import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import CategoryController from './categories.controller.js';
const router = Router();
const categoryController = new CategoryController();
router.post('/', authMiddleware, categoryController.create);
router.get('/', categoryController.findAll); // Herkese açık
router.get('/:id', categoryController.findOne); // Herkese açık
router.patch('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);
export default router;
//# sourceMappingURL=categories.routes.js.map