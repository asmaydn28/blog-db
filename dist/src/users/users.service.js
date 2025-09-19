var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../../dist/prisma.js';
import { hash } from '@node-rs/argon2';
export default class UserService {
    constructor() {
        // YENİ KULLANICI OLUŞTURMA - Sadece admin (auth/register'dan farklı)
        this.create = (userData, requestingUser) => __awaiter(this, void 0, void 0, function* () {
            // --- YETKİLENDİRME KONTROLÜ ---
            if (requestingUser.role !== 'admin') {
                throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
            }
            // --- KONTROL BİTTİ ---
            const { name, username, password, role } = userData;
            if (!name || !username || !password) {
                throw new Error('İsim, kullanıcı adı ve parola alanları zorunludur.');
            }
            const hashedPassword = yield hash(password);
            return prisma.user.create({
                data: {
                    name: name,
                    username: username,
                    hashed_password: hashedPassword,
                    role: role || 'member'
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
        // KULLANICI GÜNCELLEME - Kendi hesabı veya admin yetkisi
        this.update = (userId, userData, requestingUser) => __awaiter(this, void 0, void 0, function* () {
            // --- YETKİLENDİRME KONTROLÜ ---
            const isOwnAccount = userId === requestingUser.id;
            const isAdmin = requestingUser.role === 'admin';
            if (!isOwnAccount && !isAdmin) {
                throw new Error('Bu hesabı güncellemek için yetkiniz yok.');
            }
            const { name, username, password, role } = userData;
            const dataToUpdate = {};
            if (name)
                dataToUpdate.name = name;
            if (username)
                dataToUpdate.username = username;
            if (password) {
                dataToUpdate.hashed_password = yield hash(password);
            }
            // ÖNEMLİ: Role güncellemesi sadece admin yapabilir
            if (role) {
                if (!isAdmin) {
                    throw new Error('Rol değiştirmek için admin yetkisi gereklidir.');
                }
                dataToUpdate.role = role;
            }
            return prisma.user.update({
                where: { id: userId },
                data: dataToUpdate,
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
        // KULLANICI SİLME - Kendi hesabı veya admin yetkisi
        this.delete = (userId, requestingUser) => __awaiter(this, void 0, void 0, function* () {
            // --- YETKİLENDİRME KONTROLÜ ---
            const isOwnAccount = userId === requestingUser.id;
            const isAdmin = requestingUser.role === 'admin';
            if (!isOwnAccount && !isAdmin) {
                throw new Error('Bu hesabı silmek için yetkiniz yok.');
            }
            // --- KONTROL BİTTİ ---
            return prisma.user.update({
                where: { id: userId },
                data: { deleted_at: new Date() },
            });
        });
        // TÜM KULLANICILARI GETİRME - Herkese açık
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findMany({
                where: { deleted_at: null }, // Soft delete olanları getirme
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
        // TEK KULLANICI GETİRME - Herkese açık
        this.findOne = (userId) => __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findUnique({
                where: { id: userId, deleted_at: null },
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
    }
}
//# sourceMappingURL=users.service.js.map