var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AuthService from './auth.service.js';
export default class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const newUser = yield this.authService.register(userData);
                res.status(201).json(newUser);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = req.body;
                const tokens = yield this.authService.login(loginData);
                if (!tokens) {
                    res.status(401).json({ message: 'Geçersiz kullanıcı adı veya parola.' });
                    return;
                }
                res.status(200).json(tokens);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        this.refresh = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    res.status(400).json({ message: 'Refresh token zorunludur.' });
                    return;
                }
                const newTokens = yield this.authService.refresh(refreshToken);
                if (!newTokens) {
                    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş refresh token.' });
                    return;
                }
                res.status(200).json(newTokens);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
//# sourceMappingURL=auth.controller.js.map