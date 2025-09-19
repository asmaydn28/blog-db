var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import TagService from './tags.service.js';
export default class TagController {
    constructor() {
        this.tagService = new TagService();
        // Etiket oluşturma
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tagData = req.body;
                const user = req.user;
                const newTag = yield this.tagService.create(tagData, user);
                res.status(201).json(newTag);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        // Etiketleri listeleme
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield this.tagService.findAll();
                res.status(200).json(tags);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        // Etiket detayını getirme
        this.findOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'Etiket ID belirtilmelidir.' });
                }
                const tagId = parseInt(id);
                const tag = yield this.tagService.findOne(tagId);
                if (!tag) {
                    return res.status(404).json({ message: 'Etiket bulunamadı.' });
                }
                res.status(200).json(tag);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        // Etiket güncelleme
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const tagData = req.body;
                const user = req.user;
                const updatedTag = yield this.tagService.update(id, tagData, user);
                res.status(200).json(updatedTag);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        // Etiket silme
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const user = req.user;
                yield this.tagService.delete(id, user);
                res.status(204).send();
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=tags.controller.js.map