// src/posts/posts.routes.ts
import { Router } from 'express';
import PostController from './posts.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Import ekleyin
const router = Router();
const postController = new PostController();
// Herkese açık işlemler
router.get('/', postController.findAll); // Listeleme herkese açık
router.get('/:id', postController.findOne); // Tek görüntüleme herkese açık
// Giriş gerektiren işlemler
router.post('/', authMiddleware, postController.create); // Sadece giriş yapmışlar gönderi oluşturabilir
router.patch('/:id', authMiddleware, postController.update); // Sahiplik/rol kontrolü ile düzenleme
router.delete('/:id', authMiddleware, postController.delete); // Sahiplik/rol kontrolü ile silme
router.post('/:id/tags', authMiddleware, postController.addTag); // Etiket ekleme de korunmalı
router.delete('/:id/tags/:tagId', authMiddleware, postController.removeTag); // Etiket çıkarma da
export default router;
//# sourceMappingURL=posts.routes.js.map