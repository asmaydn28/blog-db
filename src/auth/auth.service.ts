import prisma from '../prisma.js';
import { hash, verify } from '@node-rs/argon2';
import type { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} ortam değişkeni bulunamadı.`);
  }
  return value;
}

const ACCESS_TOKEN_SECRET = getEnvVariable('ACCESS_TOKEN_SECRET');
const REFRESH_TOKEN_SECRET = getEnvVariable('REFRESH_TOKEN_SECRET');

export default class AuthService {
  public register = async (userData: any): Promise<Omit<User, 'hashed_password'>> => {
    const { name, username, password } = userData;
    if (!name || !username || !password) {
      throw new Error('İsim, kullanıcı adı ve parola alanları zorunludur.');
    }
    const hashedPassword = await hash(password);
    return prisma.user.create({
      data: {
        name: name,
        username: username,
        hashed_password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        created_at: true,
        deleted_at: true,
      },
    });
  };

  public login = async (loginData: any): Promise<{ accessToken: string; refreshToken: string } | null> => {
    const { username, password } = loginData;
    if (!username || !password) {
      throw new Error('Kullanıcı adı ve parola zorunludur.');
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await verify(user.hashed_password, password);

    if (!isPasswordValid) {
      return null;
    }

    const refreshTokenRecord = await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { 
      expiresIn: '7d',
      jwtid: refreshTokenRecord.id.toString(),
    });

    return { accessToken, refreshToken };
  };

  public refresh = async (refreshTokenString: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
    try {
      const decoded = jwt.verify(refreshTokenString, REFRESH_TOKEN_SECRET);

      if (typeof decoded !== 'object' || !decoded.jti || typeof decoded.userId !== 'number') {
        return null;
      }

      const refreshTokenId = parseInt(decoded.jti, 10);
      if (isNaN(refreshTokenId)) {
        return null;
      }

      const refreshTokenRecord = await prisma.refreshToken.findUnique({
        where: { id: refreshTokenId },
        include: { user: true },
      });

      if (!refreshTokenRecord || refreshTokenRecord.revoked_at) {
        return null;
      }

      if (refreshTokenRecord.user_id !== decoded.userId) {
        return null;
      }

      const { user } = refreshTokenRecord;
      const accessToken = jwt.sign({ userId: user.id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

      return { accessToken, refreshToken: refreshTokenString };
    } catch (error) {
      return null;
    }
  };
}