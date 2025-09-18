import type { User } from '@prisma/client';
export default class UserService {
    findAll: () => Promise<Omit<User, "hashed_password">[]>;
    findOne: (id: number) => Promise<Omit<User, "hashed_password"> | null>;
    update: (id: number, userData: any) => Promise<Omit<User, "hashed_password">>;
    delete: (id: number) => Promise<Omit<User, "hashed_password">>;
}
//# sourceMappingURL=users.service.d.ts.map