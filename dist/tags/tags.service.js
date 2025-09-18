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
export default class TagService {
    constructor() {
        // Etiket oluşturma
        this.create = (tagData) => __awaiter(this, void 0, void 0, function* () {
            if (!tagData.name) {
                throw new Error('Etiket adı (name) zorunludur.');
            }
            return prisma.tag.create({
                data: {
                    name: tagData.name,
                },
            });
        });
        // Etiketleri listeleme
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            return prisma.tag.findMany();
        });
        // Etiket detayını getirme
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.tag.findUnique({
                where: { id: id },
            });
        });
        // Etiket güncelleme
        this.update = (id, tagData) => __awaiter(this, void 0, void 0, function* () {
            return prisma.tag.update({
                where: { id: id },
                data: tagData,
            });
        });
        // Etiket silme
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            yield prisma.postTag.deleteMany({
                where: { tag_id: id },
            });
            return prisma.tag.delete({
                where: { id },
            });
        });
    }
}
//# sourceMappingURL=tags.service.js.map