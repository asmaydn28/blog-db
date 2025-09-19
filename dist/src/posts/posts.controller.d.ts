import type { Request, Response } from 'express';
export default class PostController {
    private postService;
    create: (req: any, res: Response) => Promise<void>;
    findAll: (req: Request, res: Response) => Promise<void>;
    findOne: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    addTag: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    removeTag: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=posts.controller.d.ts.map