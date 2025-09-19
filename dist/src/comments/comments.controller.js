var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CommentService from './comments.service.js';
export default class CommentController {
    constructor() {
        this.commentService = new CommentService();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const commentData = req.body;
                commentData.commenter_name = req.user.name;
                const newComment = yield this.commentService.create(commentData, req.user.id);
                res.status(201).json(newComment);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.commentService.findAll(req.query);
                res.status(200).json(comments);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.findOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'Yorum ID belirtilmelidir.' });
                }
                const commentId = parseInt(id);
                const comment = yield this.commentService.findOne(commentId);
                if (!comment) {
                    return res.status(404).json({ message: 'Yorum bulunamadı.' });
                }
                res.status(200).json(comment);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const commentData = req.body;
                const user = req.user;
                const updatedComment = yield this.commentService.update(id, commentData, user);
                res.status(200).json(updatedComment);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const user = req.user;
                yield this.commentService.delete(id, user);
                res.status(204).send();
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=comments.controller.js.map