import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz Erişim: Token bulunamadı.' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: number; role: string };

    req.user = { id: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Yetkisiz Erişim: Token geçersiz.' });
  }
};