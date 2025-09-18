var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../prisma.js';
export default class CommentService {
    constructor() {
        this.create = (commentData) => __awaiter(this, void 0, void 0, function* () {
            if (!commentData.post_id || !commentData.content || !commentData.commenter_name) {
                throw new Error('post_id, content ve commenter_name zorunludur.');
            }
            return prisma.comment.create({
                data: {
                    post_id: commentData.post_id,
                    content: commentData.content,
                    commenter_name: commentData.commenter_name,
                },
            });
        });
        // Yorumları listeleme
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            return prisma.comment.findMany();
        });
        // Yorum detayını getirme
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.comment.findUnique({ where: { id } });
        });
        // Yorum güncelleme
        this.update = (id, data) => __awaiter(this, void 0, void 0, function* () {
            return prisma.comment.update({
                where: { id },
                data,
            });
        });
        // Yorum silme
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const comment = yield prisma.comment.findUnique({ where: { id } });
            if (!comment)
                return false;
            yield prisma.comment.delete({ where: { id } });
            return true;
        });
    }
}
//# sourceMappingURL=comments.service.js.map