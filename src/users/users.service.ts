import prisma from '../prisma.js';
import { hash } from '@node-rs/argon2';
import type { User } from '@prisma/client';

export default class UserService {
  public findAll = async (): Promise<Omit<User, 'hashed_password'>[]> => {
    return prisma.user.findMany({
      where: {
        deleted_at: null,
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

  public findOne = async (id: number): Promise<Omit<User, 'hashed_password'> | null> => {
    return prisma.user.findFirst({
      where: {
        id: id,
        deleted_at: null,
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

  public update = async (id: number, userData: any): Promise<Omit<User, 'hashed_password'>> => {
    const { name, username, password } = userData;
    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (username) dataToUpdate.username = username;

    if (password) {
      dataToUpdate.hashed_password = await hash(password);
    }

    return prisma.user.update({
      where: { id: id },
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

  public delete = async (id: number): Promise<Omit<User, 'hashed_password'>> => {
    return prisma.user.update({
      where: { id: id },
      data: {
        deleted_at: new Date(),
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
}
