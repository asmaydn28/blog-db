type UserPayload = {
    id: number;
    role: string;
};
export default class TagService {
    create: (tagData: {
        name: string;
    }, user: UserPayload) => Promise<{
        name: string;
        id: number;
    }>;
    update: (id: number, tagData: {
        name?: string;
    }, user: UserPayload) => Promise<{
        name: string;
        id: number;
    }>;
    delete: (id: number, user: UserPayload) => Promise<{
        name: string;
        id: number;
    }>;
    findAll: () => Promise<{
        name: string;
        id: number;
    }[]>;
    findOne: (id: number) => Promise<{
        name: string;
        id: number;
    } | null>;
}
export {};
//# sourceMappingURL=tags.service.d.ts.map