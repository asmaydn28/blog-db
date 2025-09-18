var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserService from './users.service.js';
export default class UserController {
    constructor() {
        this.userService = new UserService();
        this.findAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.findAll();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.findOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({ message: 'ID parametresi eksik.' });
                    return;
                }
                const userId = parseInt(id);
                if (isNaN(userId)) {
                    res.status(400).json({ message: 'Geçersiz ID formatı.' });
                    return;
                }
                const user = yield this.userService.findOne(userId);
                if (!user) {
                    res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({ message: 'ID parametresi eksik.' });
                    return;
                }
                const userId = parseInt(id);
                if (isNaN(userId)) {
                    res.status(400).json({ message: 'Geçersiz ID formatı.' });
                    return;
                }
                const userData = req.body;
                const updatedUser = yield this.userService.update(userId, userData);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                if (error.code === 'P2002') {
                    res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
                }
                else {
                    res.status(400).json({ message: error.message });
                }
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({ message: 'ID parametresi eksik.' });
                    return;
                }
                const userId = parseInt(id);
                if (isNaN(userId)) {
                    res.status(400).json({ message: 'Geçersiz ID formatı.' });
                    return;
                }
                yield this.userService.delete(userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=users.controller.js.map