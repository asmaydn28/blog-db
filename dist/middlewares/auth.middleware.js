import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Yetkisiz Erişim: Token bulunamadı.' });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Yetkisiz Erişim: Token geçersiz.' });
    }
};
//# sourceMappingURL=auth.middleware.js.map