import prisma from '../../dist/prisma.js';
import { hash } from '@node-rs/argon2';
import type { User } from '@prisma/client';

type UserPayload = {
  id: number;
  role: string;
};

export default class UserService {
  // YENİ KULLANICI OLUŞTURMA - Sadece admin (auth/register'dan farklı)
  public create = async (userData: any, requestingUser: UserPayload): Promise<Omit<User, 'hashed_password'>> => {
    // --- YETKİLENDİRME KONTROLÜ ---
    if (requestingUser.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }

    const { name, username, password, role } = userData;
    if (!name || !username || !password) {
      throw new Error('İsim, kullanıcı adı ve parola alanları zorunludur.');
    }
    
    const hashedPassword = await hash(password);
    return prisma.user.create({
      data: {
        name: name,
        username: username,
        hashed_password: hashedPassword,
        role: role || 'member' 
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

  // KULLANICI GÜNCELLEME - Kendi hesabı veya admin yetkisi
  public update = async (userId: number, userData: any, requestingUser: UserPayload): Promise<Omit<User, 'hashed_password'>> => {
    // --- YETKİLENDİRME KONTROLÜ ---
    const isOwnAccount = userId === requestingUser.id;
    const isAdmin = requestingUser.role === 'admin';

    if (!isOwnAccount && !isAdmin) {
      throw new Error('Bu hesabı güncellemek için yetkiniz yok.');
    }

    const { name, username, password, role } = userData;
    const dataToUpdate: any = {};
    
    if (name) dataToUpdate.name = name;
    if (username) dataToUpdate.username = username;
    if (password) {
      dataToUpdate.hashed_password = await hash(password);
    }
    
    // ÖNEMLİ: Role güncellemesi sadece admin yapabilir
    if (role) {
      if (!isAdmin) {
        throw new Error('Rol değiştirmek için admin yetkisi gereklidir.');
      }
      dataToUpdate.role = role;
    }

    return prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
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

  // KULLANICI SİLME - Kendi hesabı veya admin yetkisi
  public delete = async (userId: number, requestingUser: UserPayload): Promise<User> => {
    // --- YETKİLENDİRME KONTROLÜ ---
    const isOwnAccount = userId === requestingUser.id;
    const isAdmin = requestingUser.role === 'admin';

    if (!isOwnAccount && !isAdmin) {
      throw new Error('Bu hesabı silmek için yetkiniz yok.');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
    });
  };

  // TÜM KULLANICILARI GETİRME - Herkese açık
  public findAll = async (): Promise<Omit<User, 'hashed_password'>[]> => {
    return prisma.user.findMany({
      where: { deleted_at: null }, // Soft delete olanları getirme
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

  // TEK KULLANICI GETİRME - Herkese açık
  public findOne = async (userId: number): Promise<Omit<User, 'hashed_password'> | null> => {
    return prisma.user.findUnique({
      where: { id: userId, deleted_at: null },
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
}