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
export default class CategoryService {
    constructor() {
        this.create = (categoryData, user) => __awaiter(this, void 0, void 0, function* () {
            // Yetkilendirme: Sadece 'admin' rolündeki kullanıcılar kategori oluşturabilir.
            if (user.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            if (!categoryData.name) {
                throw new Error('Kategori adı (name) zorunludur.');
            }
            return prisma.category.create({
                data: {
                    name: categoryData.name,
                },
            });
        });
        this.update = (id, categoryData, user) => __awaiter(this, void 0, void 0, function* () {
            // Yetkilendirme: Sadece 'admin' rolündeki kullanıcılar kategori güncelleyebilir.
            if (user.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            const dataToUpdate = {};
            if (categoryData.name !== undefined) {
                dataToUpdate.name = categoryData.name;
            }
            return prisma.category.update({
                where: { id: id },
                data: dataToUpdate,
            });
        });
        this.delete = (id, user) => __awaiter(this, void 0, void 0, function* () {
            // Yetkilendirme: Sadece 'admin' rolündeki kullanıcılar kategori silebilir.
            if (user.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            return prisma.category.update({
                where: { id: id },
                data: {
                    deleted_at: new Date(),
                },
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
            return prisma.category.findMany({ where: whereClause });
        });
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.category.findFirst({
                where: { id: id, deleted_at: null },
            });
        });
    }
}
//# sourceMappingURL=categories.service.js.map