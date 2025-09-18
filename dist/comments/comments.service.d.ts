export default class CommentService {
    create: (commentData: {
        post_id: number;
        content: string;
        commenter_name: string;
    }) => Promise<{
        created_at: Date;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }>;
    findAll: () => Promise<{
        created_at: Date;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }[]>;
    findOne: (id: number) => Promise<{
        created_at: Date;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    } | null>;
    update: (id: number, data: any) => Promise<{
        created_at: Date;
        id: number;
        content: string;
        user_id: number | null;
        post_id: number;
        commenter_name: string;
    }>;
    delete: (id: number) => Promise<boolean>;
}
//# sourceMappingURL=comments.service.d.ts.map