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
        this.create = (commentData, userId) => __awaiter(this, void 0, void 0, function* () {
            if (!commentData.content || !commentData.post_id) {
                throw new Error('İçerik ve gönderi ID zorunludur.');
            }
            return prisma.comment.create({
                data: {
                    content: commentData.content,
                    commenter_name: commentData.commenter_name,
                    post_id: commentData.post_id,
                    user_id: userId,
                }
            });
        });
        this.findAll = (filters) => __awaiter(this, void 0, void 0, function* () {
            const whereClause = {};
            if (filters.post) {
                whereClause.post_id = parseInt(filters.post);
            }
            if (filters.commenter) {
                whereClause.commenter_name = filters.commenter;
            }
            // Varsayılan olarak sadece silinmemiş yorumları getir.
            // `onlyDeleted=true` sadece silinmişleri getirir.
            // `showDeleted=true` silinmiş ve silinmemiş tüm yorumları getirir.
            if (filters.onlyDeleted === 'true') {
                whereClause.deleted_at = { not: null };
            }
            else if (filters.showDeleted !== 'true') {
                whereClause.deleted_at = null;
            }
            return prisma.comment.findMany({
                where: whereClause
            });
        });
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.comment.findFirst({
                where: { id: id, deleted_at: null }
            });
        });
        this.update = (id, commentData, user) => __awaiter(this, void 0, void 0, function* () {
            const comment = yield prisma.comment.findUnique({
                where: { id: id, deleted_at: null }
            });
            if (!comment) {
                throw new Error('Yorum bulunamadı.');
            }
            // Yetkilendirme: Sadece yorumun sahibi kendi yorumunu güncelleyebilir.
            if (comment.user_id !== user.id) {
                throw new Error('Bu yorumu düzenlemek için yetkiniz yok.');
            }
            return prisma.comment.update({
                where: { id: id },
                data: {
                    content: commentData.content,
                    // Güvenlik nedeniyle `commenter_name` güncellenemez.
                },
            });
        });
        this.delete = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const comment = yield prisma.comment.findUnique({
                where: { id: id, deleted_at: null },
                include: {
                    post: true,
                }
            });
            if (!comment) {
                throw new Error('Yorum bulunamadı.');
            }
            // Silme için yetkilendirme kuralları:
            // 1. Yorum sahibi kendi yorumunu silebilir.
            // 2. Gönderi sahibi, gönderisindeki yorumları silebilir.
            // 3. 'moderator' ve 'admin' rolündekiler tüm yorumları silebilir.
            const isCommentOwner = comment.user_id === user.id;
            const isPostOwner = comment.post.user_id === user.id;
            const isModerator = user.role === 'moderator';
            const isAdmin = user.role === 'admin';
            if (!isCommentOwner && !isPostOwner && !isModerator && !isAdmin) {
                throw new Error('Bu yorumu silmek için yetkiniz yok.');
            }
            // Yorumu geçici olarak sil (soft delete).
            return prisma.comment.update({
                where: { id: id },
                data: { deleted_at: new Date() }
            });
        });
    }
}
//# sourceMappingURL=comments.service.js.map