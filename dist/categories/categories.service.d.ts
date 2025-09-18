type UserPayload = {
    id: number;
    role: string;
};
export default class CategoryService {
    create: (categoryData: {
        name: string;
    }, user: UserPayload) => Promise<{
        name: string;
        created_at: Date;
        deleted_at: Date | null;
        id: number;
    }>;
    update: (id: number, categoryData: {
        name?: string;
    }, user: UserPayload) => Promise<{
        name: string;
        created_at: Date;
        deleted_at: Date | null;
        id: number;
    }>;
    delete: (id: number, user: UserPayload) => Promise<{
        name: string;
        created_at: Date;
        deleted_at: Date | null;
        id: number;
    }>;
    findAll: (filters: {
        showDeleted?: string;
        onlyDeleted?: string;
    }) => Promise<{
        name: string;
        created_at: Date;
        deleted_at: Date | null;
        id: number;
    }[]>;
    findOne: (id: number) => Promise<{
        name: string;
        created_at: Date;
        deleted_at: Date | null;
        id: number;
    } | null>;
}
export {};
//# sourceMappingURL=categories.service.d.ts.map