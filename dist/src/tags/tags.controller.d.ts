import type { Request, Response } from 'express';
export default class TagController {
    private tagService;
    create: (req: any, res: Response) => Promise<void>;
    findAll: (req: Request, res: Response) => Promise<void>;
    findOne: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: any, res: Response) => Promise<void>;
    delete: (req: any, res: Response) => Promise<void>;
}
//# sourceMappingURL=tags.controller.d.ts.map