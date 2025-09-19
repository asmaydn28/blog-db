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
import { hash, verify } from '@node-rs/argon2';
import jwt from 'jsonwebtoken';
function getEnvVariable(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} ortam değişkeni bulunamadı.`);
    }
    return value;
}
const ACCESS_TOKEN_SECRET = getEnvVariable('ACCESS_TOKEN_SECRET');
const REFRESH_TOKEN_SECRET = getEnvVariable('REFRESH_TOKEN_SECRET');
export default class AuthService {
    constructor() {
        this.register = (userData) => __awaiter(this, void 0, void 0, function* () {
            const { name, username, password } = userData;
            if (!name || !username || !password) {
                throw new Error('İsim, kullanıcı adı ve parola alanları zorunludur.');
            }
            const hashedPassword = yield hash(password);
            return prisma.user.create({
                data: {
                    name: name,
                    username: username,
                    hashed_password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    role: true,
                    created_at: true,
                    deleted_at: true,
                },
            });
        });
        this.login = (loginData) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = loginData;
            if (!username || !password) {
                throw new Error('Kullanıcı adı ve parola zorunludur.');
            }
            const user = yield prisma.user.findUnique({
                where: { username },
            });
            if (!user) {
                return null;
            }
            const isPasswordValid = yield verify(user.hashed_password, password);
            if (!isPasswordValid) {
                return null;
            }
            const refreshTokenRecord = yield prisma.refreshToken.create({
                data: {
                    user_id: user.id,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
            const accessToken = jwt.sign({ userId: user.id, role: user.role, name: user.name }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
                expiresIn: '7d',
                jwtid: refreshTokenRecord.id.toString(),
            });
            return { accessToken, refreshToken };
        });
        this.refresh = (refreshTokenString) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt.verify(refreshTokenString, REFRESH_TOKEN_SECRET);
                if (typeof decoded !== 'object' || !decoded.jti || typeof decoded.userId !== 'number') {
                    return null;
                }
                const refreshTokenId = parseInt(decoded.jti, 10);
                if (isNaN(refreshTokenId)) {
                    return null;
                }
                const refreshTokenRecord = yield prisma.refreshToken.findUnique({
                    where: { id: refreshTokenId },
                    include: { user: true },
                });
                if (!refreshTokenRecord || refreshTokenRecord.revoked_at) {
                    return null;
                }
                if (refreshTokenRecord.user_id !== decoded.userId) {
                    return null;
                }
                const { user } = refreshTokenRecord;
                const accessToken = jwt.sign({ userId: user.id, role: user.role, name: user.name }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                return { accessToken, refreshToken: refreshTokenString };
            }
            catch (error) {
                return null;
            }
        });
    }
}
//# sourceMappingURL=auth.service.js.map