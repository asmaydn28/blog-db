import type { User } from '@prisma/client';
type UserPayload = {
    id: number;
    role: string;
};
export default class UserService {
    create: (userData: any, requestingUser: UserPayload) => Promise<Omit<User, "hashed_password">>;
    update: (userId: number, userData: any, requestingUser: UserPayload) => Promise<Omit<User, "hashed_password">>;
    delete: (userId: number, requestingUser: UserPayload) => Promise<User>;
    findAll: () => Promise<Omit<User, "hashed_password">[]>;
    findOne: (userId: number) => Promise<Omit<User, "hashed_password"> | null>;
}
export {};
//# sourceMappingURL=users.service.d.ts.map