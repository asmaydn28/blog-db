import type { Request, Response } from 'express';
export default class TagController {
    private tagService;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    findAll: (req: Request, res: Response) => Promise<void>;
    findOne: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=tags.controller.d.ts.map