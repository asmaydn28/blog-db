import { Router } from 'express';
// Birazdan oluşturacağımız Controller'ı import ediyoruz.
import CategoryController from './categories.controller.js';

const router = Router();
// Controller sınıfından yeni bir "örnek" (instance) oluşturuyoruz.
// Bu sayede onun içindeki fonksiyonları kullanabiliriz.
const categoryController = new CategoryController();

// Gelen istekleri ilgili controller fonksiyonlarına yönlendiriyoruz.
router.post('/', categoryController.create);
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findOne);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
