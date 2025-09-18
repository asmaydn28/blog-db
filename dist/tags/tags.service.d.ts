export default class TagService {
    create: (tagData: {
        name: string;
    }) => Promise<{
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
    update: (id: number, tagData: {
        name?: string;
    }) => Promise<{
        name: string;
        id: number;
    }>;
    delete: (id: number) => Promise<{
        name: string;
        id: number;
    }>;
}
//# sourceMappingURL=tags.service.d.ts.map