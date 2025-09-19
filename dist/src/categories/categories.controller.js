var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import {} from 'express';
import CategoryService from './categories.service.js';
export default class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = req.body;
                const user = req.user;
                const newCategory = yield this.categoryService.create(categoryData, user);
                res.status(201).json(newCategory);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                const categories = yield this.categoryService.findAll(filters);
                res.status(200).json(categories);
            }
            catch (error) {
                res.status(500).json({ message: 'Kategoriler listelenirken bir hata oluştu.' });
            }
        });
        this.findOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'ID parametresi eksik.' });
                }
                const categoryId = parseInt(id);
                const category = yield this.categoryService.findOne(categoryId);
                if (!category) {
                    return res.status(404).json({ message: 'Kategori bulunamadı.' });
                }
                res.status(200).json(category);
            }
            catch (error) {
                res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu.' });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'ID parametresi eksik.' });
                }
                const categoryId = parseInt(id);
                const categoryData = req.body;
                const user = req.user;
                const updatedCategory = yield this.categoryService.update(categoryId, categoryData, user);
                res.status(200).json(updatedCategory);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'ID parametresi eksik.' });
                }
                const categoryId = parseInt(id);
                const user = req.user;
                yield this.categoryService.delete(categoryId, user);
                res.status(204).send();
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=categories.controller.js.map