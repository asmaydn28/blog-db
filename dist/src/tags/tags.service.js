var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../prisma.js";
export default class TagService {
    constructor() {
        // CREATE - Sadece admin
        this.create = (tagData, user) => __awaiter(this, void 0, void 0, function* () {
            // --- YETKİLENDİRME KONTROLÜ ---
            if (user.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            // --- KONTROL BİTTİ ---
            if (!tagData.name) {
                throw new Error('Etiket adı (name) zorunludur.');
            }
            return prisma.tag.create({
                data: { name: tagData.name }
            });
        });
        // UPDATE - Sadece admin
        this.update = (id, tagData, user) => __awaiter(this, void 0, void 0, function* () {
            // --- YETKİLENDİRME KONTROLÜ ---
            if (user.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            // --- KONTROL BİTTİ ---
            if (!tagData.name) {
                throw new Error('Etiket adı (name) boş olamaz.');
            }
            return prisma.tag.update({
                where: { id: id },
                data: { name: tagData.name }
            });
        });
        // DELETE - Sadece admin  
        this.delete = (id, user) => __awaiter(this, void 0, void 0, function* () {
            // --- YETKİLENDİRME KONTROLÜ ---
            if (user.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            // --- KONTROL BİTTİ ---
            // Tags tablosunda deleted_at yok, hard delete
            return prisma.tag.delete({
                where: { id: id }
            });
        });
        // FINDALL - Herkese açık (değişmez)
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            return prisma.tag.findMany();
        });
        // FINDONE - Herkese açık (değişmez)
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.tag.findUnique({
                where: { id: id }
            });
        });
    }
}
//# sourceMappingURL=tags.service.js.map