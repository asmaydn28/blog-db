// src/users/users.routes.ts
import { Router } from 'express';
import UserController from './users.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
const userController = new UserController();
// Herkese açık işlemler
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
// Kimlik doğrulama gerektiren işlemler
router.post('/', authMiddleware, userController.create);
router.patch('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.delete);
export default router;
//# sourceMappingURL=users.routes.js.map