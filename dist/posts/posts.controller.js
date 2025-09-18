var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PostService from './posts.service.js';
export default class PostController {
    constructor() {
        this.postService = new PostService();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = req.body;
                const userId = req.user.id;
                const newPost = yield this.postService.create(postData, userId);
                res.status(201).json(newPost);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        // Tüm postları listeleme
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                const posts = yield this.postService.findAll(filters);
                res.status(200).json(posts);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        // Tek post getirme
        this.findOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
                }
                const postId = parseInt(id, 10);
                const post = yield this.postService.findOne(postId);
                if (!post) {
                    return res.status(404).json({ message: 'Post bulunamadı.' });
                }
                res.status(200).json(post);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        // Post güncelleme
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
                }
                const postId = parseInt(id);
                const postData = req.body;
                const user = req.user; // Middleware'den gelen kullanıcı bilgisi
                const updatedPost = yield this.postService.update(postId, postData, user);
                res.status(200).json(updatedPost);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        // Post silme
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
                }
                const postId = parseInt(id);
                const user = req.user;
                yield this.postService.delete(postId, user);
                res.status(204).send();
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        // Gönderiye etiket ekleme
        this.addTag = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
                }
                const postId = parseInt(id);
                const { tag_id } = req.body;
                const user = req.user;
                yield this.postService.addTag(postId, tag_id, user);
                res.status(201).json({ message: 'Etiket gönderiye başarıyla eklendi.' });
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        // Gönderiden etiket çıkarma
        this.removeTag = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, tagId } = req.params;
                if (!id || !tagId) {
                    return res.status(400).json({ message: 'Post ID ve Tag ID belirtilmelidir.' });
                }
                const postId = parseInt(id);
                const tagIdInt = parseInt(tagId);
                const user = req.user;
                yield this.postService.removeTag(postId, tagIdInt, user);
                res.status(204).send();
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=posts.controller.js.map