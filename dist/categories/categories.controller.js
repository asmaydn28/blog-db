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
        // YENİ KATEGORİ OLUŞTURMA
        // Bu fonksiyon, bir önceki adımdaki gibi kalacak.
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = req.body;
                const user = req.user; // Middleware'den gelen kullanıcı bilgisini al
                const newCategory = yield this.categoryService.create(categoryData, user); // ve Service'e gönder
                res.status(201).json(newCategory);
            }
            catch (error) {
                // Service'ten bir yetki hatası gelirse, 403 Forbidden (Yasak) kodu döndürmek daha doğrudur.
                res.status(403).json({ message: error.message });
            }
        });
        // TÜM KATEGORİLERİ LİSTELEME
        // Bu herkese açık olduğu için 'req.user' bilgisine ihtiyacı yok ve değişmiyor.
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
        // TEK KATEGORİ GETİRME
        // Bu da herkese açık olduğu için 'req.user' bilgisine ihtiyacı yok ve değişmiyor.
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
        // --- YENİ EKLENEN/GÜNCELLENEN FONKSİYONLAR ---
        // KATEGORİ GÜNCELLEME
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'ID parametresi eksik.' });
                }
                const categoryId = parseInt(id); // Hangi kategorinin güncelleneceği
                const categoryData = req.body; // Yeni veriler ne olacak
                const user = req.user; // Bu isteği kim yapıyor
                // 2. Tüm bu bilgileri Service katmanına "sipariş" olarak geçiyoruz.
                const updatedCategory = yield this.categoryService.update(categoryId, categoryData, user);
                // 3. Başarılı sonucu kullanıcıya döndürüyoruz.
                res.status(200).json(updatedCategory);
            }
            catch (error) {
                // Service katmanında bir yetki hatası oluşursa (örn: kullanıcı admin değilse),
                // bu hatayı yakalayıp 403 koduyla kullanıcıya bildiriyoruz.
                res.status(403).json({ message: error.message });
            }
        });
        // KATEGORİ SİLME
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'ID parametresi eksik.' });
                }
                const categoryId = parseInt(id); // Hangi kategori silinecek
                const user = req.user; // Bu isteği kim yapıyor
                // 2. Silme "siparişini" Service katmanına iletiyoruz.
                yield this.categoryService.delete(categoryId, user);
                // 3. Başarılı silme işleminden sonra 204 No Content status kodu döndürüyoruz.
                res.status(204).send();
            }
            catch (error) {
                // Yine, Service katmanında bir yetki hatası oluşursa yakalıyoruz.
                res.status(403).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=categories.controller.js.map