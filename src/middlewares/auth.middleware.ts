import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    name: string;
  };
}

interface DecodedToken {
  userId: number;
  role: string;
  name: string;
  jti: string; 
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz Erişim: Token bulunamadı.' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedToken;

    if (!decoded.jti) {
      return res.status(401).json({ message: 'Yetkisiz Erişim: Token oturum bilgisi içermiyor.' });
    }

    const refreshTokenId = parseInt(decoded.jti, 10);
    if (isNaN(refreshTokenId)) {
      return res.status(401).json({ message: 'Yetkisiz Erişim: Geçersiz oturum bilgisi.' });
    }

    const session = await prisma.refreshToken.findUnique({
      where: { id: refreshTokenId },
    });

    if (!session || session.revoked_at) {
      return res.status(401).json({ message: 'Yetkisiz Erişim: Oturum sonlandırılmış veya geçersiz.' });
    }

    req.user = { id: decoded.userId, role: decoded.role, name: decoded.name };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Yetkisiz Erişim: Token süresi dolmuş.' });
    }
    return res.status(401).json({ message: 'Yetkisiz Erişim: Token geçersiz.' });
  }
};
