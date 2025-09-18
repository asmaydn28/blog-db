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
import { hash } from '@node-rs/argon2';
export default class UserService {
    constructor() {
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findMany({
                where: {
                    deleted_at: null,
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
        this.findOne = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findFirst({
                where: {
                    id: id,
                    deleted_at: null,
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
        this.update = (id, userData) => __awaiter(this, void 0, void 0, function* () {
            const { name, username, password } = userData;
            const dataToUpdate = {};
            if (name)
                dataToUpdate.name = name;
            if (username)
                dataToUpdate.username = username;
            if (password) {
                dataToUpdate.hashed_password = yield hash(password);
            }
            return prisma.user.update({
                where: { id: id },
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
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            return prisma.user.update({
                where: { id: id },
                data: {
                    deleted_at: new Date(),
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
    }
}
//# sourceMappingURL=users.service.js.map