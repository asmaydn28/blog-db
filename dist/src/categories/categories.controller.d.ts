import { type Request, type Response } from 'express';
export default class CategoryController {
    private categoryService;
    create: (req: any, res: Response) => Promise<void>;
    findAll: (req: Request, res: Response) => Promise<void>;
    findOne: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=categories.controller.d.ts.map