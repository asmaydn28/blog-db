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
export default class PostService {
    constructor() {
        this.create = (postData, userId) => __awaiter(this, void 0, void 0, function* () {
            return prisma.post.create({
                data: {
                    title: postData.title,
                    content: postData.content,
                    category_id: postData.category_id,
                    user_id: userId
                }
            });
        });
        this.findAll = (filters) => __awaiter(this, void 0, void 0, function* () {
            const whereClause = {};
            if (filters.onlyDeleted === 'true') {
                whereClause.deleted_at = { not: null };
            }
            else if (filters.showDeleted !== 'true') {
                whereClause.deleted_at = null;
            }
            return prisma.post.findMany({ where: whereClause });
        });
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.post.findFirst({
                where: { id, deleted_at: null },
            });
        });
        this.update = (id, postData, user) => __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
                where: { id: id, deleted_at: null }
            });
            if (!post) {
                throw new Error('Gönderi bulunamadı.');
            }
            // Yetkilendirme:
            // - Gönderi sahibi kendi gönderisini düzenleyebilir.
            // - Moderator başkasının gönderisini düzenleyebilir.
            // - Admin her şeyi yapabilir.
            const isOwner = post.user_id === user.id;
            const isModerator = user.role === 'moderator';
            const isAdmin = user.role === 'admin';
            if (!isOwner && !isModerator && !isAdmin) {
                throw new Error('Bu gönderiyi düzenlemek için yetkiniz yok.');
            }
            return prisma.post.update({
                where: { id: id },
                data: {
                    title: postData.title,
                    content: postData.content,
                    category_id: postData.category_id,
                },
            });
        });
        this.delete = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
                where: { id: id, deleted_at: null }
            });
            if (!post) {
                throw new Error('Gönderi bulunamadı.');
            }
            // Yetkilendirme: Sadece gönderi sahibi veya admin silebilir.
            const isOwner = post.user_id === user.id;
            const isAdmin = user.role === 'admin';
            if (!isOwner && !isAdmin) {
                throw new Error('Bu gönderiyi silmek için yetkiniz yok.');
            }
            return prisma.post.update({
                where: { id: id },
                data: { deleted_at: new Date() },
            });
        });
        this.addTag = (postId, tagId, user) => __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
                where: { id: postId }
            });
            if (!post) {
                throw new Error('Gönderi bulunamadı.');
            }
            // Yetkilendirme: Gönderi sahibi veya moderator/admin etiket ekleyebilir.
            const isOwner = post.user_id === user.id;
            const isModerator = user.role === 'moderator';
            const isAdmin = user.role === 'admin';
            if (!isOwner && !isModerator && !isAdmin) {
                throw new Error('Bu gönderiye etiket eklemek için yetkiniz yok.');
            }
            return prisma.postTag.create({
                data: { post_id: postId, tag_id: tagId }
            });
        });
        this.removeTag = (postId, tagId, user) => __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
                where: { id: postId }
            });
            if (!post) {
                throw new Error('Gönderi bulunamadı.');
            }
            // Yetkilendirme: Gönderi sahibi veya moderator/admin etiket çıkarabilir.
            const isOwner = post.user_id === user.id;
            const isModerator = user.role === 'moderator';
            const isAdmin = user.role === 'admin';
            if (!isOwner && !isModerator && !isAdmin) {
                throw new Error('Bu gönderiden etiket çıkarmak için yetkiniz yok.');
            }
            return prisma.postTag.delete({
                where: {
                    post_id_tag_id: { post_id: postId, tag_id: tagId }
                }
            });
        });
    }
}
//# sourceMappingURL=posts.service.js.map