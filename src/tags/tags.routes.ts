import { Router } from 'express';
import TagController from './tags.controller.js';

const router = Router();
const tagController = new TagController();

router.post('/', tagController.create);
router.get('/', tagController.findAll);
router.get('/:id', tagController.findOne);
router.patch('/:id', tagController.update);
router.delete('/:id', tagController.delete);

export default router;
