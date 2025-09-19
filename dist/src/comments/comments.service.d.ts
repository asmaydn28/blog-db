type UserPayload = {
    id: number;
    role: string;
};
export default class CommentService {
    create: (commentData: any, userId: number) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }>;
    findAll: (filters: any) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }[]>;
    findOne: (id: number) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    } | null>;
    update: (id: number, commentData: any, user: UserPayload) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }>;
    delete: (id: number, user: UserPayload) => Promise<{
        created_at: Date;
        deleted_at: Date | null;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }>;
}
export {};
//# sourceMappingURL=comments.service.d.ts.map