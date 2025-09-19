type UserPayload = {
    id: number;
    role: string;
};
export default class PostService {
    create: (postData: {
        title: string;
        content: string;
        category_id: number;
    }, userId: number) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        title: string;
        content: string;
        published_at: Date | null;
        category_id: number;
        user_id: number | null;
    }>;
    findAll: (filters: {
        showDeleted?: string;
        onlyDeleted?: string;
    }) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        title: string;
        content: string;
        published_at: Date | null;
        category_id: number;
        user_id: number | null;
    }[]>;
    findOne: (id: number) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        title: string;
        content: string;
        published_at: Date | null;
        category_id: number;
        user_id: number | null;
    } | null>;
    update: (id: number, postData: any, user: UserPayload) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        title: string;
        content: string;
        published_at: Date | null;
        category_id: number;
        user_id: number | null;
    }>;
    delete: (id: number, user: UserPayload) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        title: string;
        content: string;
        published_at: Date | null;
        category_id: number;
        user_id: number | null;
    }>;
    addTag: (postId: number, tagId: number, user: UserPayload) => Promise<{
        post_id: number;
        tag_id: number;
    }>;
    removeTag: (postId: number, tagId: number, user: UserPayload) => Promise<{
        post_id: number;
        tag_id: number;
    }>;
}
export {};
//# sourceMappingURL=posts.service.d.ts.map