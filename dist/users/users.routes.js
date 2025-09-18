import { Router } from 'express';
import UserController from './users.controller.js';
const router = Router();
const userController = new UserController();
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.patch('/:id', userController.update);
router.delete('/:id', userController.delete);
export default router;
//# sourceMappingURL=users.routes.js.map